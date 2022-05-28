import React from "react";
import ListingsPage from "pages/ListingsPage/listingsPage";
import LoggedListingsPage from "pages/LoggedListingsPage/loggedListingPage";
import AboutusPage from "pages/AboutusPage";
import RegisterPage from "pages/RegisterPage";
import LoginPage from "pages/LoginPage";
import LandingPage from "pages/LandingPage";
import CreateListingPage from "pages/CreateListingPage/createListingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "pages/Home";
import NotFound from "pages/NotFound";

const ProjectRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/registerpage" element={<RegisterPage />} />
        <Route path="/aboutuspage" element={<AboutusPage />} />
        <Route path="/listingspage" element={<ListingsPage />} />
        <Route path="/loggedlistingspage" element={<LoggedListingsPage />} />
        <Route path="/dhiwise-dashboard" element={<Home />} />
        <Route path="/create-listing" element={<CreateListingPage />} />
      </Routes>
    </Router>
  );
};

export default ProjectRoutes;
