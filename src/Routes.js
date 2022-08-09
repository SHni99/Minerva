import React, { useContext } from "react";
import AuthContext from "util/AuthContext";
import BanPage from "pages/BanPage/banPage";
import LoadingOverlay from "react-loading-overlay-ts";
import ListingsPage from "pages/ListingsPage/listingsPage";
import UpdateProfilePage from "pages/UpdateProfilePage/updateProfile";
import AboutusPage from "pages/AboutusPage/aboutUsPage";
import RegisterPage from "pages/RegisterPage/register";
import LoginPage from "pages/LoginPage/login";
import LandingPage from "pages/LandingPage/landingPage";
import PasswordPage from "pages/ForgotPasswordPage/password";
import ResetPage from "pages/ResetPage/resetPage";
import LoginMainPage from "pages/loginMainPage/loginMain";
import CreateListingPage from "pages/CreateListingPage/createListingPage";
import ProfilePage from "pages/ProfilePage/profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "pages/NotFound";
import ChatPage from "pages/ChatPage/chatPage";
import ViewReportsPage from "pages/ViewReportsPage/viewReportsPage";
import ChatLogsPage from "pages/ChatLogsPage/chatLogsPage";
import HashLoader from "react-spinners/HashLoader";

const ProjectRoutes = () => {
  // Determine if user is banned :(((((
  const { authData, authLoading, BANNED_THRESHOLD } = useContext(AuthContext);
  const isBanned = authData.permissions <= BANNED_THRESHOLD;
  return (
    <LoadingOverlay
      active={authLoading}
      spinner={<HashLoader color="silver" size="30vw" />}
      styles={{
        overlay: (base) => ({
          ...base,
          background: "gray",
        }),
        content: (base) => ({
          ...base,
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }),
      }}
    >
      <Router>
        <AnimatedRoutes isBanned={isBanned} />
      </Router>
    </LoadingOverlay>
  );
};

export default ProjectRoutes;

const AnimatedRoutes = ({ isBanned }) => {
  // Add TransitionGroup and CSSTransition for animations
  return !isBanned ? (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/loginpage" element={<LoginPage />} />
      <Route path="/registerpage" element={<RegisterPage />} />
      <Route path="/aboutuspage" element={<AboutusPage />} />
      <Route path="/listingspage" element={<ListingsPage />} />
      <Route path="/profilepage" element={<UpdateProfilePage />} />
      <Route path="/create-listing" element={<CreateListingPage />} />
      <Route path="/passwordpage" element={<PasswordPage />} />
      <Route path="/resetpage" element={<ResetPage />} />
      <Route path="/loginmainpage" element={<LoginMainPage />} />

      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/chats" element={<ChatPage />} />
      <Route path="/reports" element={<ViewReportsPage />} />
      <Route path="/chatlogs" element={<ChatLogsPage />} />
      <Route path="/edit-listing" element={<CreateListingPage isEditing />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/" element={<BanPage />} />
      <Route path="*" element={<BanPage />} />
    </Routes>
  );
};
