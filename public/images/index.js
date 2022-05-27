import React, { Component } from 'react';
import styles from "./FooterBar.css";

class FooterBar extends Component {
    render() { 
        return (
            <div className="footer">
                <Divider />
                <Bar 
                    copyrightText={(
                        <React.Fragment>
                            2022 © Minerva
                            <br />
                            All rights reserved.
                        </React.Fragment>
                    )}
                    iconInstagram="/images/img_instagram1.png"
                    iconTwitter="/images/img_twitter1.png"
                    iconFacebook="/images/img_facebook1.png"
                />     
            </div>
        );
    }
}

function Divider() {
    return (
      <div className="divider divider-master"></div>  
    );
}

function Bar(props) {
    const { copyrightText, iconInsta, iconTwitter, iconFacebook } = props;
}
 
export default FooterBar;