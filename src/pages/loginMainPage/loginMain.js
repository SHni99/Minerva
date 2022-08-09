import React, { useState, useEffect, useContext } from "react";
import { supabaseClient } from "../../config/supabase-client";
import Login from "pages/LoginPage/login";
import Profile from "pages/UpdateProfilePage/updateProfile";
import ToastContext from "util/ToastContext";

export default function LoginMainPage() {
  //value pass into setSession will update session
  const [session, setSession] = useState(null);
  const { showSimpleToast } = useContext(ToastContext);

  // backend trigger to execute for next event
  useEffect(() => {
    setSession(supabaseClient.auth.session());

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    // if there is a session exists, it will direct to updateprofile page, else login page
    <div>
      {!session ? (
        <Login />
      ) : (
        <Profile
          key={session.user.id}
          session={session}
          showSimpleToast={showSimpleToast}
        />
      )}
    </div>
  );
}
