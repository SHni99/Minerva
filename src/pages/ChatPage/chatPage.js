import React, { useEffect } from "react";
import { useState } from "react";
import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";
import { supabaseClient as supabase } from "config/supabase-client";
import {
  Avatar,
  MainContainer,
  ChatContainer,
  MessageInput,
  Sidebar,
  Search,
  ConversationList,
  ConversationHeader,
  Conversation,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import chatPageStyles from "./chatPage.module.css";

const ChatPage = () => {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <ChatPageBody />
      <FooterBar />
    </div>
  );
};

export default ChatPage;

const ChatPageBody = (props) => {
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

  // Handles the onClick event for the Conversation items (the left sidebar)
  const handleConvoClick = (chatId) => {
    setShowSidebar(false);
    setActiveChatId(chatId);
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

        const newMessages = data.map(({ created_at, sender_id, payload }) => {
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
        });

        setMessages(newMessages);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoadingMessages(false);
      }
    };
    getOldMessages();
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
        let newConversations = await Promise.all(
          convoData.map(async ({ id, participants, messages }) => {
            const { payload, sender_id } = messages;
            const uid = supabase.auth.user().id;

            // Get the id in `participants` that is not equal to the current user id
            const partnerId =
              participants[0] === uid ? participants[1] : participants[0];

            // If the last message is sent by the user, prefix the message with a "You: "
            // If the message is an image, display "(You:) sent an image" instead
            const message = `${sender_id === uid ? "You: " : ""}${
              payload.imageUrl ? "sent an Image" : payload.text
            }`;

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
                : supabase.storage
                    .from("avatars")
                    .getPublicUrl(userData.avatar_url).data.publicURL;

            return {
              chat_id: id,
              name: userData.username,
              user_id: partnerId,
              message,
              src: avatarUrl,
            };
          })
        );
        newConversations = newConversations.reduce((res, convo) => {
          const { chat_id, name, user_id, message, src } = convo;
          res[chat_id] = { name, user_id, message, src };
          return res;
        }, {});

        if (Object.keys(newConversations).length === 0) setShowSidebar(false);
        setConversations(newConversations);
      } catch (error) {
        console.log(error);
        alert(error.message);
      } finally {
        setLoadingConvos(false);
      }
    };
    fetchConvos();
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
                  info={conversations[id].message}
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
                />
                <ConversationHeader.Content
                  userName={conversations[activeChatId].name}
                  className={`${chatPageStyles["convo-header"]}`}
                />
              </ConversationHeader>
            }

            <MessageInput
              placeholder="Your message here..."
              className={`${chatPageStyles["message-input"]}`}
            />
          </ChatContainer>
        )}
      </MainContainer>
    </div>
  );
};