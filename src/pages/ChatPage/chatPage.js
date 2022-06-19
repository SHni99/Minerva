import React from "react";
import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";
import Container from "react-bootstrap/Container";

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
  return <Container></Container>;
};
