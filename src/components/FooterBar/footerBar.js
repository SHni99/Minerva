import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import footerBarStyles from "./footerBar.module.css";

class FooterBar extends Component {
    render() { 
        return (
            <div className={footerBarStyles.footer}>
                <Divider />
                <Bar 
                    copyrightText={
                        <React.Fragment>
                            2022 © Minerva
                            <br />
                            All rights reserved.
                        </React.Fragment>
                    }
                    iconInstagram="/images/img_instagram1.png"
                    iconTwitter="/images/img_twitter1.png"
                    iconFacebook="/images/img_facebook1.png"
                />
            </div>
        );
    }
}
 
export default FooterBar;

function Divider() {
  return (
    <div className={`${footerBarStyles.divider} ${footerBarStyles["divider-master"]}`}>
    </div>
  );
}

function Bar(props) {
  const { copyrightText, iconInstagram, iconTwitter, iconFacebook } = props;

  return (
    <div className={footerBarStyles.bar}>
      <p className={`${footerBarStyles["copyrightText"]} ${footerBarStyles["valign-text-middle"]} text-smregular`}>
        {copyrightText}
      </p>

      <Links />

      <SocialMedia icons={{iconInstagram, iconTwitter, iconFacebook}}/>

    </div>
  );
}

function Links() {
    return (
        <div className={footerBarStyles.links}>
            <FooterLink label="Home" referTo='/' minWidth="40px"/>
            <FooterLink label="Privacy Policy" referTo='/' minWidth="100px"/>
            <FooterLink label="Terms of Service" referTo='/' minWidth="120px" />
            <FooterLink label="About Us" referTo="/aboutuspage" minWidth="80px" />
        </div>
    )
}

function FooterLink(props) {
    const { label, referTo, minWidth } = props;
    return (
        <Link 
            className={`${footerBarStyles["footer-link"]} ${footerBarStyles["button-variant-set-master"]} ${footerBarStyles["button-master"]}`}
            style={{ minWidth }}
         to={referTo}>
            <div className={`${footerBarStyles["text"]} text-smmedium`}>{label}</div>
        </Link>
    )
}

function SocialMedia(props) {
    const { iconInstagram, iconTwitter, iconFacebook } = props.icons;
    return (
      <div className={footerBarStyles["social-media"]}>

        <Link to='/' >
            <img className={footerBarStyles["icon-instagram"]} src={iconInstagram} alt="Instagram Icon"/>
        </Link>

        <Link to='/' >
            <img className={footerBarStyles["icon-twitter"]} src={iconTwitter} alt="Twitter Icon"/>
        </Link>

        <Link to='/'>
            <img className={footerBarStyles["icon-facebook"]} src={iconFacebook} alt="Facebook Icon"/>
        </Link>

      </div>
    );
}