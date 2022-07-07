import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    logged_in: false,
    permissions: 0,
    is_banned: false,
    username: null,
    avatar_url: null,
    id: null,
  });
  const [authLoading, setAuthLoading] = useState(false);
  const ADMIN_THRESHOLD = 1;

  return (
    <AuthContext.Provider
      value={{
        authData,
        setAuthData,
        authLoading,
        setAuthLoading,
        ADMIN_THRESHOLD,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
