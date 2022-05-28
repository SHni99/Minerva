import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import navBarStyles from "./navBar.module.css";
import { supabaseClient as supabase } from "../../config/supabase-client"

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);

    const minervaLogoSrc = "/images/img_minervaLogo.png";

    const getUser = async () => {
        try {
            const user = supabase.auth.user();

            if (!user) return;
            setIsLoggedIn(true);

            let { data, error, status } = await supabase
                .from("profiles")
                .select("avatar_url")
                .eq("id", user.id)
                .single();
            
            if (error && status !== 406) throw error;
            if (data) {
                setAvatarUrl(data.avatarUrl);
            }
        } catch (error) {
            alert(error.message);
        } 
    }

    const generateNavBarLinks = () => {
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

    useEffect(() => getUser(), []);

    return (
        <div className={navBarStyles.navBar}>
            <Link to="/"> <img className={navBarStyles.minerva_logo} src={minervaLogoSrc} alt="Minerva Logo" /> </Link>
            <div className={navBarStyles.links}>{ generateNavBarLinks() }</div>
            <CredentialsCorner isLoggedIn={isLoggedIn} avatarUrl={avatarUrl}/> 
        </div>
    );
}

export default NavBar;

function CredentialsCorner(props) {
    const { isLoggedIn, avatarUrl } = props;

    if (isLoggedIn) {
        return (
            <div 
            className={navBarStyles["avatar"]} 
            style={{
                backgroundImage: ( avatarUrl || `url("/images/img_avatarDefault.jpg")`)
            }} /> 
        );
    }

    return (
        <div className={navBarStyles.credentialsCorner}>
            <Link className={`${navBarStyles["login-button"]} ${navBarStyles["button-variant-set-master-3"]} ${navBarStyles["button-master-3"]}`} to='/loginpage'>
                <div className={`inter nunitosans-normal-endeavour-20px`}>Log in</div>
            </Link>

            <Link className={`${navBarStyles["sign-up-button"]} ${navBarStyles["button-master-4"]}`} to="/registerpage">
                <div className={`${navBarStyles["text-2"]} nunitosans-normal-white-20px`}>Sign Up</div>
            </Link>
        </div>
    );
}