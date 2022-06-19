import React, { useEffect } from "react";
import { useState } from "react";
import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";
import {
  Avatar,
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
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
  const [showSidebar, setShowSidebar] = useState(true);

  const removeClass = (elem, name) => {
    elem.className = elem.className
      .split(" ")
      .filter((cName) => cName !== name)
      .join(" ");
  };

  const addClass = (elem, name) => {
    elem.className += ` ${name}`;
  };

  useEffect(() => {
    const sidebarElem = document.getElementsByClassName("cs-sidebar")[0];
    const searchBarElem = document.getElementsByClassName("cs-search")[0];
    const convoAvatarElem = document.getElementsByClassName("cs-avatar")[0];
    const chatContainerElem =
      document.getElementsByClassName("cs-chat-container")[0];
    const convoContentElems = Array.from(
      document.getElementsByClassName("cs-conversation__content")
    );

    if (showSidebar && !sidebarElem.className.includes("sidebar-visible")) {
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
        <Sidebar position="left" scrollable>
          <Search
            placeholder="Search..."
            className={`${chatPageStyles["cs-search"]} py-0`}
          />
          <ConversationList>
            <Conversation
              onClick={() => {
                if (showSidebar) setShowSidebar(false);
              }}
            >
              <Avatar src="/images/img_avatarDefault.jpg" name="DERP" />
              <Conversation.Content name="TEST USER" />
            </Conversation>
          </ConversationList>
        </Sidebar>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back onClick={() => setShowSidebar(true)} />
            <Avatar src="/images/img_avatarDefault.jpg" name="DERP" />
          </ConversationHeader>
          <MessageInput placeholder="Your message here..." />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};
