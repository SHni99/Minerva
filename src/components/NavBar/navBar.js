import React, { Component } from 'react';
import { Link } from "react-router-dom";
import navBarStyles from "./navBar.module.css";

class NavBar extends Component {

    generateNavBarLinks = () => {
        return (
            <React.Fragment>
                <Link className={`${navBarStyles["home-link"]} ${navBarStyles["button-variant-set-master"]} ${navBarStyles["button-master"]}`} to='/'>
                    <div className={`${navBarStyles["text"]} inter-medium-black-20px`}> Home </div>
                </Link>

                <Link className={`${navBarStyles["listings-link"]} ${navBarStyles["button-variant-set-master-2"]} ${navBarStyles["button-master-2"]}`} to='/listingspage'>
                    <div className={`${navBarStyles["text-1"]} inter-medium-black-20px`}>Listings</div>
                </Link>

                <Link className={`${navBarStyles["aboutus-link"]} ${navBarStyles["button-variant-set-master"]} ${navBarStyles["button-master"]}`} to='/aboutuspage'>
                    <div className={`${navBarStyles["text"]} inter-medium-black-20px`}> About Us </div>
                </Link>
            </React.Fragment>
        );
    }

    generateLoginSignup = () => {
        return (
            <React.Fragment>
                <Link className={`${navBarStyles["login-button"]} ${navBarStyles["button-variant-set-master-3"]} ${navBarStyles["button-master-3"]}`} to='/loginpage'>
                    <div className={`inter nunitosans-normal-endeavour-20px`}>Log in</div>
                </Link>

                <Link className={`${navBarStyles["sign-up-button"]} ${navBarStyles["button-master-4"]}`} to="/registerpage">
                    <div className={`${navBarStyles["text-2"]} nunitosans-normal-white-20px`}>Sign Up</div>
                </Link>
            </React.Fragment>
        );
    };

    render() { 
        const minervaLogoSrc = "/images/img_minervaLogo.png";

        return (
            <div className={navBarStyles.navBar}>
                <Link to="/"> <img className={navBarStyles.minerva_logo} src={minervaLogoSrc} alt="Minerva Logo" /> </Link>
                <div className={navBarStyles.links}>{ this.generateNavBarLinks() }</div>
                <div className={navBarStyles.loginSignup}> { this.generateLoginSignup() } </div>
            </div>
        );
    }
}

export default NavBar;