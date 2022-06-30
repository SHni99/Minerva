import React from "react";
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

const ProjectRoutes = ({ setToastOptions }) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/loginpage"
          element={<LoginPage setToastOptions={setToastOptions} />}
        />
        <Route path="/registerpage" element={<RegisterPage />} />
        <Route path="/aboutuspage" element={<AboutusPage />} />
        <Route path="/listingspage" element={<ListingsPage />} />
        <Route path="/profilepage" element={<UpdateProfilePage />} />
        <Route path="/create-listing" element={<CreateListingPage />} />
        <Route path="/passwordpage" element={<PasswordPage />} />
        <Route path="/resetpage" element={<ResetPage />} />
        <Route path="/loginmainpage" element={<LoginMainPage />} />
        <Route path="/formpage" element={<ReviewForm />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default ProjectRoutes;
