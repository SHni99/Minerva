import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "./NavBar.css";

class NavBar extends Component {

    generateNavBarLinks = () => {
        return (
            <React.Fragment>
                <Link className="home-link button-variant-set-master button-master" to='/'>
                    <div className="text inter-medium-black-20px"> Home </div>
                </Link>

                <Link className="listings-link button-variant-set-master-2 button-master-2" to='/listingspage'>
                    <div className="text-1 inter-medium-black-20px">Listings</div>
                </Link>

                <Link className="aboutus-link button-variant-set-master button-master" to='/aboutuspage'>
                    <div className="text inter-medium-black-20px"> About Us </div>
                </Link>
            </React.Fragment>
        );
    }

    generateLoginSignup = () => {
        return (
            <React.Fragment>
                <Link className="login-button button-variant-set-master-3 button-master-3" to='/loginpage'>
                    <div className="inter nunitosans-normal-endeavour-20px">Log in</div>
                </Link>

                <Link className="sign-up-button button-master-4" to="/registerpage">
                    <div className="text-2 nunitosans-normal-white-20px">Sign Up</div>
                </Link>
            </React.Fragment>
        );
    };

    render() { 
        const minervaLogoSrc = "/images/img_minervaLogo.png";

        return (
            <div className="navBar">
                <Link to="/"> <img className="minerva_logo" src={minervaLogoSrc} alt="Minerva Logo" /> </Link>
                <div className="links">{ this.generateNavBarLinks() }</div>
                <div className="loginSignup"> { this.generateLoginSignup() } </div>
            </div>
        );
    }
}

export default NavBar;