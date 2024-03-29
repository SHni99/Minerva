import React from "react";
import aboutUsStyles from "./aboutUsPage.module.css";

import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";

const AboutUsPage = () => {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <AboutUsBody
        shenghanImgUrl="/images/img_shenghan.jpg"
        chunzhiImgUrl="/images/img_chunzhi.jpg"
      />
      <FooterBar />
    </div>
  );
};

export default AboutUsPage;

function AboutUsBody(props) {
  const { shenghanImgUrl, chunzhiImgUrl } = props;

  const introText = (
    <React.Fragment>
      Hello! We are two students studying Computer Science in NUS.
      <br />
      This project was created as part of Orbital 2022, and it is meant to
      tackle the lack of proper tuition-matching services in Singapore.
      <br />
      We hope that this project can benefit both tutors and tutees by making the
      matching process easier and simpler!
    </React.Fragment>
  );

  const missionText = (
    <React.Fragment>
      The team name, Minerva, was chosen as the Roman goddess epitomises wisdom,
      presenting an image befitting of our vision for the project.
      <br />
      The main goal of this project is to create a convenient platform for
      tutors and tutees to connect, facilitating the proliferation of knowledge.
    </React.Fragment>
  );

  return (
    <div className={`${aboutUsStyles["body"]}`}>
      <div
        className={
          "row row-sm-12 mb-5 text-center poppins-semi-bold-black-64px"
        }
      >
        About Us
      </div>

      <div className={`row text-center`}>
        <div className={`col-lg-4 col-sm-12 mr-auto py-2`}>
          <div
            className={`${aboutUsStyles["avatarmaster"]} mx-auto`}
            style={{ backgroundImage: `url(${shenghanImgUrl})` }}
          />
          <div className="row">
            <div className={` poppins-semi-bold-black-24px`}>Ni Shenghan</div>
            <div className={` poppins-normal-black-24px`}>
              Telegram: @boba_fatt
              <br />
              GitHub: SHni99
            </div>
          </div>
        </div>

        <div className={`col-lg-4 col-sm-12 ml-auto py-2`}>
          <div
            className={`${aboutUsStyles["avatarmaster"]} mx-auto`}
            style={{ backgroundImage: `url(${chunzhiImgUrl})` }}
          />
          <div className={`poppins-semi-bold-black-24px`}>Kok Chun Zhi</div>
          <div className={`poppins-normal-black-24px`}>
            Telegram: @kokcz
            <br />
            GitHub: chunzkok
          </div>
        </div>
      </div>

      <div className={aboutUsStyles["divider-master"]}></div>

      <div className={`row-sm-12 text-center inter-normal-black-24px`}>
        {introText}
      </div>

      <div className={aboutUsStyles["divider-master"]}></div>

      <div className={"row-sm-12 text-center"}>
        <span className={`poppins-semi-bold-black-64px`}>
          Our mission
          <br />
        </span>
        <span className={`${aboutUsStyles["span1"]} inter-normal-black-24px`}>
          {missionText}
        </span>
      </div>
    </div>
  );
}
