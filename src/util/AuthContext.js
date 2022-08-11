import { createContext, useState } from "react";
import { supabaseClient as supabase } from "config/supabase-client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    logged_in: false,
    permissions: 0,
    username: null,
    avatar_url: null,
    id: null,
    blocked: [],
    preferences: {},
    email: null,
  });
  const [authLoading, setAuthLoading] = useState(false);
  // Maximum permission level for a banned user
  const BANNED_THRESHOLD = -1;

  // Minimum permission level for an admin
  const ADMIN_THRESHOLD = 1;

  // Takes in 2 arguments:
  // 1. showSimpleToast: method that displays a simple toast (taken from ToastContext)
  // 2. navigate: method provided by a useNavigate() call in the relevant page
  const handleLogout = (showSimpleToast, navigate) => {
    navigate("/");
    supabase.auth.signOut().then(({ error }) => {
      if (error) alert(error);
      else
        showSimpleToast(
          "Logged Out",
          "You have successfully logged out.",
          2000
        );
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        setAuthData,
        authLoading,
        setAuthLoading,
        handleLogout,
        ADMIN_THRESHOLD,
        BANNED_THRESHOLD,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
