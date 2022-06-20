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
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);

  // The ID of the other party the current user is currently chatting with
  const [activeChatId, setActiveChatId] = useState(null);

  // The data containing the conversations to be loaded under the ConversationList.
  // Stored as an array with objects of the following format:
  // {
  //   name: String,
  //   id: String,
  //   message: String,
  //   src: String
  // }
  const [conversations, setConversations] = useState([]);
  // Boolean denoted whether the conversations are currently being fetched or not
  const [loadingConvos, setLoadingConvos] = useState(false);

  // Helper functions to add/remove classes from elements
  const removeClass = (elem, name) => {
    elem.className = elem.className
      .split(" ")
      .filter((cName) => cName !== name)
      .join(" ");
  };
  const addClass = (elem, name) => {
    elem.className += ` ${name}`;
  };

  // Handles the onClick event for the Conversation items (the left sidebar)
  const handleConvoClick = (chatId) => {
    setShowSidebar(false);
    setActiveChatId(chatId);
  };

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
          .select("participants, messages(sender_id, payload)");
        if (convoError) throw convoError;

        // Convert each row of convoData into the appropriate format for `conversations`
        const newConversations = await Promise.all(
          convoData.map(async ({ messages, participants }) => {
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
              name: userData.username,
              id: partnerId,
              message,
              src: avatarUrl,
            };
          })
        );

        console.log(newConversations);
        setConversations(newConversations);
      } catch (error) {
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
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
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

    if (
      window.innerWidth < 768 &&
      showSidebar &&
      !sidebarElem.className.includes("sidebar-visible")
    ) {
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
  }, [showSidebar]);

  return (
    <div className={chatPageStyles.body}>
      <MainContainer responsive>
        <Sidebar position="left" loading={loadingConvos} scrollable>
          <Search
            placeholder="Search..."
            className={`${chatPageStyles["cs-search"]} py-0`}
          />
          <ConversationList>
            {conversations.map(({ name, message, src, id }) => (
              <Conversation
                onClick={() => handleConvoClick(id)}
                key={id}
                active={activeChatId === id}
              >
                <Avatar src={src} name={name} />
                <Conversation.Content name={name} info={message} />
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back onClick={() => setShowSidebar(true)} />
            <Avatar src="/images/img_avatarDefault.jpg" name="DERP" />
          </ConversationHeader>
          <MessageInput
            placeholder="Your message here..."
            className={`${chatPageStyles["message-input"]}`}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};
