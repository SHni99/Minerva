import moment from "moment";
import {
  Avatar,
  AvatarGroup,
  ChatContainer,
  ConversationHeader,
  MainContainer,
  MessageList,
  Message,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabaseClient as supabase } from "config/supabase-client";
import ChatLogStyles from "./chatLogsPage.module.css";
import { decode } from "html-entities";

const ChatLogsPage = ({ setToastOptions }) => {
  // Minimum permission level required to be considered an admin.
  const ADMIN_THRESHOLD = 1;

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <ChatLogs
        ADMIN_THRESHOLD={ADMIN_THRESHOLD}
        setToastOptions={setToastOptions}
      />
      <FooterBar />
    </div>
  );
};

export default ChatLogsPage;

const ChatLogs = ({ ADMIN_THRESHOLD, setToastOptions }) => {
  // State should have two objects: sender and recepient.
  // Each of these two objects should have three attributes: id, name and avatar_url.
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Conversation data for easier message parsing.
  // Is an object that contains two objects -- one for each participant in the conversation.
  // These two objects should contain two attributes: avatar (string) and recepient (bool).
  const [convoData, setConvoData] = useState(null);

  // Messages in a simpler format for easier parsing.
  // Has 6 attributes:
  // message_id, time, type, content, sender_id
  const [messages, setMessages] = useState(null);

  // Helper function to parse raw Supabase message data
  const parseMessage = ({ message_id, created_at, sender_id, payload }) => {
    // Change this to expand the number of supported message types
    const type = Object.keys(payload)[0];

    // Change code here for content to expand supported content types
    return {
      message_id,
      time: created_at,
      type,
      content: payload[type],
      sender_id,
    };
  };

  const generateSingleMessage = (msgData, position) => {
    const { message_id, time, content, type, sender_id } = msgData;
    const { recepient, avatar } = convoData[sender_id];
    const direction = recepient ? "outgoing" : "incoming";
    const lastOrSingle = position === "last" || position === "single";
    switch (type) {
      case "text":
        return (
          <Message
            key={message_id}
            model={{
              message: decode(content).replace("<br>", "\n"),
              direction,
              position,
            }}
            type={"text"}
            avatarSpacer={!lastOrSingle}
          >
            {lastOrSingle && <Avatar src={avatar} className="mb-3" />}
            {lastOrSingle && (
              <Message.Footer
                sentTime={moment(time).format("LT")}
                className={ChatLogStyles["msg-footer"]}
              />
            )}
          </Message>
        );
      case "image":
        return (
          <Message
            key={message_id}
            model={{
              direction,
              position,
            }}
            type={"image"}
            avatarSpacer={!lastOrSingle}
          >
            {lastOrSingle && <Avatar src={avatar} className="mb-3" />}
            <Message.CustomContent>
              <img
                src={content}
                width={window.innerWidth / (window.innerWidth < 768 ? 2 : 4)}
                alt="Sent message"
              />
            </Message.CustomContent>
          </Message>
        );
      case "offer":
        return (
          <Message
            key={message_id}
            model={{
              direction,
              position,
            }}
            type={"custom"}
            avatarSpacer={!lastOrSingle}
          >
            {lastOrSingle && <Avatar src={avatar} className="mb-3" />}
            <Message.CustomContent className="text-center p-3">
              <h4>
                {content === "MAKE_OFFER"
                  ? "Made an offer!"
                  : "Accepted the offer!"}
              </h4>
              <p className="py-0 my-1">
                {content === "MAKE_OFFER"
                  ? "Accept the deal by clicking the button above."
                  : "You can now leave reviews for each other."}
              </p>
            </Message.CustomContent>
            {lastOrSingle && (
              <Message.Footer
                sentTime={moment(time).format("LT")}
                className={ChatLogStyles["msg-footer"]}
              />
            )}
          </Message>
        );
      case "review":
        return (
          <Message
            key={message_id}
            model={{
              direction,
              position,
            }}
            type={"custom"}
            avatarSpacer={!lastOrSingle}
          >
            {lastOrSingle && <Avatar src={avatar} className="mb-3" />}
            <Message.CustomContent className="text-center p-3">
              <h4>Left a review!</h4>
              <p className="py-0 my-1">
                Reviews can be found under your profile page.
              </p>
            </Message.CustomContent>
            {lastOrSingle && (
              <Message.Footer
                sentTime={moment(time).format("LT")}
                className={ChatLogStyles["msg-footer"]}
              />
            )}
          </Message>
        );
      default:
        return (
          <Message key={"unknown-" + time}>
            <Message.CustomContent>
              unknown_message_type: {`(${type}, ${content})`}
            </Message.CustomContent>
          </Message>
        );
    }
  };

  // Helper function to generate array of Messsages from a single sender
  const generateMessages = (msgList) => {
    if (msgList.length === 0) return [];

    if (msgList.length === 1) {
      return [generateSingleMessage(msgList[0], "single")];
    } else {
      // Initialise result array with first message
      const res = [generateSingleMessage(msgList[0], "first")];

      // Add messages between first and last message
      for (let i = 1; i < msgList.length - 1; i++) {
        res.push(generateSingleMessage(msgList[i], "normal"));
      }

      // Add last message
      res.push(generateSingleMessage(msgList[msgList.length - 1], "last"));

      return res;
    }
  };
  // Run only once, at the start
  useEffect(() => {
    (async () => {
      try {
        // Check permissions
        let { data, error } = await supabase
          .from("profiles")
          .select("permissions")
          .eq("id", supabase.auth.user().id)
          .single();
        if (error) throw error;

        if (data.permissions >= ADMIN_THRESHOLD) {
          if (!state) return;

          const { recepient, sender } = state;
          // Parse conversation data for easier decoding
          setConvoData(() => {
            const newConvoData = {};
            newConvoData[recepient.id] = {
              recepient: true,
              avatar: !recepient.avatar_url
                ? "/images/img_avatarDefault.jpg"
                : supabase.storage
                    .from("avatars")
                    .getPublicUrl(recepient.avatar_url).publicURL,
            };
            newConvoData[sender.id] = {
              recepient: false,
              avatar: !sender.avatar_url
                ? "/images/img_avatarDefault.jpg"
                : supabase.storage
                    .from("avatars")
                    .getPublicUrl(sender.avatar_url).publicURL,
            };
            return newConvoData;
          });

          // Fetch messages belonging to this conversation
          let { data, error } = await supabase.rpc("get_messages", {
            id1: recepient.id,
            id2: sender.id,
          });
          console.log(data);
          if (error) throw error;

          setMessages(data.map(parseMessage));
        } else {
          // User not authorised, redirect to landing page
          navigate("/");
          setToastOptions({
            show: true,
            closeButton: false,
            position: "bottom-end",
            containerClasses: "p-4",
            variant: "danger",
            autohide: true,
            delay: 3000,
            headerContent: "Unauthorised User",
            bodyContent: "You are not authorised to access this page.",
          });
        }
      } catch (error) {
        // alert(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();

    // We are disabling warnings regarding missing dependencies
    // as we want this to run once and only once, at the start.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainContainer className={ChatLogStyles.body}>
      <ChatContainer>
        {state && !loading && (
          <ConversationHeader>
            <ConversationHeader.Back onClick={() => navigate("/reports")} />
            <AvatarGroup>
              <Avatar
                src={
                  !state.sender.avatar_url
                    ? "/images/img_avatarDefault.jpg"
                    : supabase.storage
                        .from("avatars")
                        .getPublicUrl(state.sender.avatar_url).publicURL
                }
                name={state.sender.username}
              />
              <Avatar
                src={
                  !state.recepient.avatar_url
                    ? "/images/img_avatarDefault.jpg"
                    : supabase.storage
                        .from("avatars")
                        .getPublicUrl(state.recepient.avatar_url).publicURL
                }
                name={state.recepient.username}
              />
            </AvatarGroup>
            <ConversationHeader.Content>
              {`${state.sender.username}, ${state.recepient.username}`}
            </ConversationHeader.Content>
            <ConversationHeader.Actions></ConversationHeader.Actions>
          </ConversationHeader>
        )}
        <MessageList loading={loading}>
          {!loading &&
            (state ? (
              (() => {
                const msgElems = [];
                let currentDate = null;
                let msgGroup = [];

                for (let i = 0; i < messages.length; i++) {
                  const { time, sender_id } = messages[i];
                  const { recepient } = convoData[sender_id];
                  const date = moment(time).format("L");
                  if (date !== currentDate) {
                    currentDate = date;
                    msgElems.push(...generateMessages(msgGroup));
                    msgElems.push(
                      <MessageSeparator
                        content={moment(time).format("LL")}
                        key={time}
                      />
                    );
                    msgGroup = [messages[i]];
                  } else {
                    if (
                      i === 0 ||
                      recepient ===
                        convoData[messages[i - 1].sender_id].recepient
                    ) {
                      msgGroup.push(messages[i]);
                    } else {
                      msgElems.push(...generateMessages(msgGroup));
                      msgGroup = [messages[i]];
                    }
                  }
                }
                if (msgGroup.length > 0)
                  msgElems.push(...generateMessages(msgGroup));

                return msgElems;
              })()
            ) : (
              <MessageList.Content className={ChatLogStyles["empty-chat"]}>
                <p>
                  No users captured. Try selecting a chat from{" "}
                  <a href="/reports">a report</a> instead.
                </p>
              </MessageList.Content>
            ))}
        </MessageList>
      </ChatContainer>
    </MainContainer>
  );
};
