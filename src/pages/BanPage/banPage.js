import React from "react";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";

const BanPage = () => {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      U BANND
      <FooterBar />
    </div>
  );
};

export default BanPage;
