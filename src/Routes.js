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
import ReviewForm from "pages/ReviewForm/ReviewForm";
import ProfilePage from "pages/ProfilePage/profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "pages/NotFound";
import ChatPage from "pages/ChatPage/chatPage";
import ReviewPage from "pages/ReviewPage/reviewPage";
import ViewReportsPage from "pages/ViewReportsPage/viewReportsPage";
import ChatLogsPage from "pages/ChatLogsPage/chatLogsPage";
import HashLoader from "react-spinners/HashLoader";

const ProjectRoutes = ({ setToastOptions, blockedArray, setBlockedArray, option, setOption }) => {
  // Simplify toast showing
  const showSimpleToast = (title, message, timeout) =>
    setToastOptions({
      show: true,
      closeButton: false,
      position: "bottom-end",
      containerClasses: "p-4",
      variant: "light",
      autohide: true,
      delay: timeout,
      headerContent: title,
      bodyContent: message,
    });
  // Determine if user is banned :(((((
  const { authData, authLoading, BANNED_THRESHOLD } = useContext(AuthContext);
  const isBanned = authData.permissions <= BANNED_THRESHOLD;
  return (
    <LoadingOverlay
      active={authLoading}
      spinner={<HashLoader color="silver" size="30vw" />}
    >
      <Router>
        {authLoading ? (
          <div style={{ width: "100vw", height: "100vh" }}></div>
        ) : (
          <AnimatedRoutes
            isBanned={isBanned}
            showSimpleToast={showSimpleToast}
            setToastOptions={setToastOptions}
            authLoading={authLoading}
            blockedArray={blockedArray}
            setBlockedArray={setBlockedArray}
            option={option}
            setOption={setOption}
          />
        )}
      </Router>
    </LoadingOverlay>
  );
};

export default ProjectRoutes;

const AnimatedRoutes = ({
  isBanned,
  showSimpleToast,
  setToastOptions,
  authLoading,
  blockedArray,
  setBlockedArray,
  option,
  setOption
}) => {
  // Add TransitionGroup and CSSTransition for animations
  return authLoading ? (
    <div style={{ width: "100vw", height: "100vh" }}></div>
  ) : !isBanned ? (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<NotFound />} />
      <Route
        path="/loginpage"
        element={<LoginPage showSimpleToast={showSimpleToast} />}
      />
      <Route path="/registerpage" element={<RegisterPage />} />
      <Route path="/aboutuspage" element={<AboutusPage />} />
      <Route
        path="/listingspage"
        element={<ListingsPage blockedArray={blockedArray} />}
      />
      <Route path="/profilepage" element={<UpdateProfilePage />} />
      <Route path="/create-listing" element={<CreateListingPage />} />
      <Route path="/passwordpage" element={<PasswordPage />} />
      <Route path="/resetpage" element={<ResetPage />} />
      <Route path="/loginmainpage" element={<LoginMainPage />} />
      <Route path="/formpage" element={<ReviewForm />} />
      <Route
        path="/profile"
        element={
          <ProfilePage
            blockedArray={blockedArray}
            setBlockedArray={setBlockedArray}
            option={option}
            setOption={setOption}
          />
        }
      />
      <Route path="/review" element={<ReviewPage />} />
      <Route
        path="/chats"
        element={
          <ChatPage
            blockedArray={blockedArray}
            setBlockedArray={setBlockedArray}
          />
        }
      />
      <Route
        path="/reports"
        element={<ViewReportsPage setToastOptions={setToastOptions} />}
      />
      <Route
        path="/chatlogs"
        element={<ChatLogsPage setToastOptions={setToastOptions} />}
      />
    </Routes>
  ) : (
    <Routes>
      <Route path="/" element={<BanPage />} />
      <Route path="*" element={<BanPage />} />
    </Routes>
  );
};
