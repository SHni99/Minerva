import React, { useEffect } from "react";
import moment from "moment";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";
import { supabaseClient as supabase } from "config/supabase-client";
import {
  Avatar,
  MainContainer,
  ChatContainer,
  Message,
  MessageInput,
  Sidebar,
  Search,
  ConversationList,
  ConversationHeader,
  Conversation,
  MessageList,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import chatPageStyles from "./chatPage.module.css";
import Spinner from "react-bootstrap/Spinner";

const ChatPage = () => {
  const { state } = useLocation();
  const creator_id = state ? state.creator_id : null;

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <ChatPageBody creator_id={creator_id} />
      <FooterBar />
    </div>
  );
};

export default ChatPage;

const ChatPageBody = ({ creator_id }) => {
  // Whether to show the Sidebar or not. Applicable when window width is under 768px.
  const [showSidebar, setShowSidebar] = useState(window.innerWidth < 768);

  // The ID of the current active chat
  const [activeChatId, setActiveChatId] = useState(null);

  /* Array of objects which represent a message each.
     Structure: {
       time (ISO format),
       type (text/image),
       content,
       isOwnMessage (true if sent by current user)
     }
  */
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  /* The data containing the conversations to be loaded under the ConversationList.
     Stored as an object of objects.
     Key: chat_id
     Value:
     {
       user_id,
       name,
       src,
       message
     } 
  */
  const [conversations, setConversations] = useState([]);
  // Boolean denoted whether the conversations are currently being fetched or not
  const [loadingConvos, setLoadingConvos] = useState(false);

  const navigate = useNavigate();

  // Helper functions to add/remove classes from elements
  const removeClass = (elem, name) => {
    if (!elem || !elem.className.includes(name)) return;

    elem.className = elem.className
      .split(" ")
      .filter((cName) => cName !== name)
      .join(" ");
  };
  const addClass = (elem, name) => {
    if (!elem || elem.className.includes(name)) return;

    elem.className += ` ${name}`;
  };

  const generateSingleMessage = (msgData, position) => {
    const { time, content, type, isOwnMessage } = msgData;
    const lastOrSingle = position === "last" || position === "single";
    return (
      <Message
        key={"message" + time}
        model={{
          message: content.replace("&nbsp; ", "\n"),
          direction: isOwnMessage ? "outgoing" : "incoming",
          position,
        }}
        type={type}
        avatarSpacer={!isOwnMessage && !lastOrSingle}
      >
        {!isOwnMessage && lastOrSingle && (
          <Avatar src={conversations[activeChatId].src} className="mb-3" />
        )}
        {lastOrSingle && (
          <Message.Footer
            sentTime={moment(time).format("LT")}
            className={chatPageStyles["msg-footer"]}
          />
        )}
      </Message>
    );
  };

  if (creator_id) {
    console.log(creator_id);
  }
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

  // Helper function to parse raw Supabase message data
  const parseMessage = ({ created_at, sender_id, payload }) => {
    // Change this to expand the number of supported message types
    // Currently only supports image and text content
    const type = payload.imageUrl ? "image" : "text";

    // Change code here for content to expand supported content types
    return {
      time: created_at,
      type,
      content: payload[type === "image" ? "imageUrl" : "text"],
      isOwnMessage: sender_id === supabase.auth.user().id,
    };
  };

  // Helper function to parse raw Supabase conversation data
  const parseConvo = async ({ id, participants, messages }) => {
    const uid = supabase.auth.user().id;

    // Get the id in `participants` that is not equal to the current user id
    const partnerId =
      participants[0] === uid ? participants[1] : participants[0];

    // If the last message is sent by the user, prefix the message with a "You: "
    // If the message is an image, display "(You:) sent an image" instead
    const message = messages
      ? `${messages.sender_id === uid ? "You: " : ""}${
          messages.payload.imageUrl ? "sent an Image" : messages.payload.text
        }`
      : "";

    // Fetch username and avatar url from the profiles table
    let { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", partnerId)
      .single();
    if (userError) throw userError;

    // If avatar url from the profiles table is empty, set it to the default profile pic.
    const avatarUrl =
      userData.avatar_url === ""
        ? "/images/img_avatarDefault.jpg"
        : supabase.storage.from("avatars").getPublicUrl(userData.avatar_url)
            .data.publicURL;

    return {
      chat_id: id,
      name: userData.username,
      user_id: partnerId,
      message,
      src: avatarUrl,
    };
  };

  // Handles the onClick event for the Conversation items (the left sidebar)
  const handleConvoClick = (chatId) => {
    setShowSidebar(false);
    setActiveChatId(chatId);
  };

  const handleMsgSend = async (msg) => {
    try {
      let { data, error } = await supabase.from("messages").insert({
        recipient_id: conversations[activeChatId].user_id,
        payload: {
          text: msg,
        },
        convo_id: activeChatId,
      });
      if (error) throw error;

      let { error: lastMsgError } = await supabase
        .from("conversations")
        .update({ last_msg: data[0].id })
        .eq("id", activeChatId);
      if (lastMsgError) throw lastMsgError;
    } catch (error) {
      alert(error.message);
    }
  };

  // Fetches messages in chat
  useEffect(() => {
    if (!activeChatId) return;
    // Loads old messages and listens for any new messages
    const getOldMessages = async () => {
      try {
        setLoadingMessages(true);

        let { data, error } = await supabase
          .from("messages")
          .select("created_at, sender_id, payload")
          .eq("convo_id", activeChatId)
          .order("created_at", { ascending: true });
        if (error) throw error;

        const newMessages = data.map(parseMessage);

        setMessages(newMessages);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoadingMessages(false);
      }
    };
    getOldMessages();

    // Subscribe to INSERT events with convo_id === activeChatId
    const msgSub = supabase
      .from(`messages:convo_id=eq.${activeChatId}`)
      .on("INSERT", (payload) =>
        setMessages((oldMessages) => [
          ...oldMessages,
          parseMessage(payload.new),
        ])
      )
      .subscribe();

    return () => supabase.removeSubscription(msgSub);
  }, [activeChatId]);

  // Fetch all conversations and store them in `conversations`
  // Run only once, at the start.
  // Currently only supports direct messages. Group chats might be added (TBC)
  useEffect(() => {
    const fetchConvos = async () => {
      try {
        setLoadingConvos(true);

        // Fetch data from conversations and messages table
        let { data: convoData, error: convoError } = await supabase
          .from("conversations")
          .select("id, participants, messages(sender_id, payload)")
          .order("created_at", { ascending: false, foreignTable: "messages" });
        if (convoError) throw convoError;

        // Convert each row of convoData into the appropriate format for `conversations`
        let newConversations = await Promise.all(convoData.map(parseConvo));
        newConversations = newConversations.reduce((res, convo) => {
          const { chat_id, name, user_id, message, src } = convo;
          res[chat_id] = { name, user_id, message, src };
          return res;
        }, {});

        if (Object.keys(newConversations).length === 0) setShowSidebar(false);
        setConversations(newConversations);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoadingConvos(false);
      }
    };
    fetchConvos();

    // Subscribe to INSERT and UPDATE events
    const convoSub = supabase
      .from("conversations")
      .on("UPDATE", async (payload) => {
        try {
          let { data, error } = await supabase
            .from("messages")
            .select("sender_id, payload")
            .eq("id", payload.new.last_msg)
            .single();
          if (error) throw error;

          setConversations((oldConversations) => {
            const newConversations = { ...oldConversations };
            newConversations[payload.new.id].message = `${
              data.sender_id === supabase.auth.user().id ? "You: " : ""
            }${data.payload.imageUrl ? "sent an Image" : data.payload.text}`;

            return newConversations;
          });
        } catch (error) {
          alert(error.message);
        }
      })
      .on("INSERT", async (payload) => {
        const newConvo = await parseConvo(payload.new);
        setConversations((oldConvos) => {
          const newConvos = { ...oldConvos };
          const { chat_id, name, user_id, message, src } = newConvo;
          newConvos[chat_id] = { name, user_id, message, src };
          return newConvos;
        });
      })
      .subscribe();

    return () => supabase.removeSubscription(convoSub);
  }, []);

  // Add event listener to show correct layout on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(false);
      } else if (!activeChatId) {
        setShowSidebar(
          document.getElementsByClassName("cs-conversation").length
        );
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
    // We are disabling the eslint warning regarding useEffect having
    // missing dependencies as we do not need to re-setup the event handler
    // on any state change.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle showing/hiding of the sidebar on showSidebar change
  useEffect(() => {
    const sidebarElem = document.getElementsByClassName("cs-sidebar")[0];
    const searchBarElem = document.getElementsByClassName("cs-search")[0];
    const convoAvatarElem = document.getElementsByClassName("cs-avatar")[0];
    const chatContainerElem =
      document.getElementsByClassName("cs-chat-container")[0];
    const convoContentElems = Array.from(
      document.getElementsByClassName("cs-conversation__content")
    );

    if (window.innerWidth < 768 && showSidebar) {
      addClass(sidebarElem, chatPageStyles["sidebar-visible"]);
      addClass(convoAvatarElem, chatPageStyles["convoAvatar-visible"]);
      addClass(searchBarElem, chatPageStyles["convoContent-visible"]);
      addClass(chatContainerElem, chatPageStyles["chatContainer-invisible"]);
      convoContentElems.forEach((convoContent) =>
        addClass(convoContent, chatPageStyles["convoContent-visible"])
      );
    } else if (
      !showSidebar &&
      sidebarElem.className.includes("sidebar-visible")
    ) {
      removeClass(sidebarElem, chatPageStyles["sidebar-visible"]);
      removeClass(searchBarElem, chatPageStyles["convoContent-visible"]);
      removeClass(convoAvatarElem, chatPageStyles["convoAvatar-visible"]);
      removeClass(chatContainerElem, chatPageStyles["chatContainer-invisible"]);
      convoContentElems.forEach((convoContent) =>
        removeClass(convoContent, chatPageStyles["convoContent-visible"])
      );
    }
  }, [showSidebar, loadingConvos]);

  return (
    <div className={chatPageStyles.body}>
      <MainContainer responsive>
        <Sidebar position="left" loading={loadingConvos} scrollable>
          <Search
            placeholder="Search..."
            className={`${chatPageStyles["cs-search"]} py-0`}
          />
          <ConversationList>
            {Object.keys(conversations).map((id) => (
              <Conversation
                onClick={() => handleConvoClick(id)}
                key={id}
                active={activeChatId === id}
              >
                <Avatar
                  src={conversations[id].src}
                  name={conversations[id].name}
                />
                <Conversation.Content
                  name={conversations[id].name}
                  info={conversations[id].message.replace("&nbsp; ", "; ")}
                />
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>
        {!activeChatId ? (
          <ChatContainer>
            <MessageList>
              <MessageList.Content
                className={`${chatPageStyles["empty-chat"]}`}
              >
                <p className="px-md-5">
                  Nothing here! <br /> Try{" "}
                  {window.innerWidth < 768
                    ? "starting "
                    : "selecting a chat on the left or start "}
                  a new conversation from
                  <a href="/listingspage" className="ms-2">
                    a listing
                  </a>
                  .
                </p>
              </MessageList.Content>
            </MessageList>
          </ChatContainer>
        ) : (
          <ChatContainer>
            {
              <ConversationHeader>
                <ConversationHeader.Back onClick={() => setShowSidebar(true)} />
                <Avatar
                  src={conversations[activeChatId].src}
                  name={conversations[activeChatId].name}
                  onClick={() =>
                    navigate("/profile", {
                      state: {
                        creator_id: conversations[activeChatId].user_id,
                      },
                    })
                  }
                />
                <ConversationHeader.Content
                  userName={conversations[activeChatId].name}
                  className={`${chatPageStyles["convo-header"]}`}
                  onClick={() =>
                    navigate("/profile", {
                      state: {
                        creator_id: conversations[activeChatId].user_id,
                      },
                    })
                  }
                />
              </ConversationHeader>
            }

            {loadingMessages ? (
              <MessageList>
                <MessageList.Content
                  className={`${chatPageStyles["empty-chat"]}`}
                >
                  <Spinner
                    animation="border"
                    role="status"
                    aria-label="Loading"
                  />
                </MessageList.Content>
              </MessageList>
            ) : (
              <MessageList className="py-2">
                {(() => {
                  const msgElems = [];
                  let currentDate = null;
                  let msgGroup = [];

                  for (let i = 0; i < messages.length; i++) {
                    const { time, isOwnMessage } = messages[i];
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
                        isOwnMessage === messages[i - 1].isOwnMessage
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
                })()}
              </MessageList>
            )}

            <MessageInput
              placeholder="Your message here..."
              className={`${chatPageStyles["message-input"]}`}
              onSend={handleMsgSend}
            />
          </ChatContainer>
        )}
      </MainContainer>
    </div>
  );
};
