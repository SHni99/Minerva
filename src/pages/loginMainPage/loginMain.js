import React, { useState, useEffect } from 'react'
import { supabaseClient } from "../../config/supabase-client";
import Login from 'pages/LoginPage/login';
import Profile from 'pages/ProfilePage/profile';

export default function LoginMainPage() {
  //value pass into setSession will update session
    const [session, setSession] = useState(null)

  // backend trigger to execute for next event
  useEffect(() => {
    setSession(supabaseClient.auth.session())

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, []);

  return (
     // if there is a session exists, it will direct to profile page, else login page
    <div
    style={{padding: '50px 0 100px 0'}}>
      {!session ? < Login /> : 
      <Profile key={session.user.id} session={session} />}
    </div>
  );

}