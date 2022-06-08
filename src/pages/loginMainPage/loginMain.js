import React, { useState, useEffect } from 'react'
import { supabaseClient } from "../../config/supabase-client";
import Login from 'pages/LoginPage/index';
import Profile from 'pages/ProfilePage/profile';

export default function LoginMainPage() {
    const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabaseClient.auth.session())

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, []);

  return (
    <div
    style={{padding: '50px 0 100px 0'}}>
      {!session ? < Login /> : 
      <Profile key={session.user.id} session={session} />}
    </div>
  );

}