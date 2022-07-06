import {
  Avatar,
  AvatarGroup,
  ChatContainer,
  ConversationHeader,
  MainContainer,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabaseClient as supabase } from "config/supabase-client";
import ChatLogStyles from "./chatLogsPage.module.css";

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
              avatar: supabase.storage
                .from("avatars")
                .getPublicUrl(recepient.avatar_url).publicURL,
            };
            newConvoData[sender.id] = {
              recepient: false,
              avatar: supabase.storage
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
            <AvatarGroup>
              <Avatar
                src={
                  supabase.storage
                    .from("avatars")
                    .getPublicUrl(state.sender.avatar_url).publicURL
                }
                name={state.sender.username}
              />
              <Avatar
                src={
                  supabase.storage
                    .from("avatars")
                    .getPublicUrl(state.recepient.avatar_url).publicURL
                }
                name={state.recepient.username}
              />
            </AvatarGroup>
            <ConversationHeader.Content>
              {`${state.sender.username}, ${state.recepient.username}`}
            </ConversationHeader.Content>
            <ConversationHeader.Actions />
          </ConversationHeader>
        )}
        <MessageList loading={loading}>
          {!loading &&
            (state ? (
              <MessageList.Content>hi</MessageList.Content>
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
