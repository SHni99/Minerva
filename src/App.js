import { useContext, useEffect, useRef } from "react";
import Routes from "./Routes";
import AuthContext from "util/AuthContext";
import { supabaseClient } from "config/supabase-client";
import { ToastProvider } from "util/ToastContext";

function App() {
  // =================== Start of AuthContext initialisation =================
  const { authData, setAuthData, setAuthLoading } = useContext(AuthContext);
  const profileSub = useRef(null);

  const parseProfile = (profileData) => {
    const {
      id,
      username,
      avatar_url,
      permissions,
      preferences,
      blocked,
      gender,
      bio,
      email,
    } = profileData;
    return {
      logged_in: true,
      username,
      gender,
      bio,
      permissions,
      preferences,
      avatar_url: avatar_url
        ? supabaseClient.storage.from("avatars").getPublicUrl(avatar_url)
            .publicURL
        : "/images/img_avatarDefault.jpg",
      id,
      blocked,
      email,
    };
  };
  // Initialise authData and setup listeners, only done once at the start.
  useEffect(() => {
    const getAccountData = async (user_id) => {
      try {
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", user_id)
          .single();
        if (error) throw error;
        return data;
      } catch (error) {
        alert(error.message);
      }
    };

    // Fetch initial user state
    if (supabaseClient.auth.user()) {
      (async () => {
        setAuthLoading(true);
        const accountData = await getAccountData(supabaseClient.auth.user().id);
        setAuthData(parseProfile(accountData));
        setAuthLoading(false);
      })();
    }

    const parseSession = async (session) => {
      if (!session)
        return {
          logged_in: false,
          permissions: 0,
          username: null,
          avatar_url: null,
          preferences: {},
          id: null,
          bio: null,
          gender: null,
          email: null,
        };

      const { user } = session;

      return parseProfile(await getAccountData(user?.id));
    };

    supabaseClient.auth.onAuthStateChange(async (_, session) => {
      setAuthLoading(true);
      setAuthData(await parseSession(session));
      setAuthLoading(false);
    });
  }, [setAuthData, setAuthLoading]);

  // Also set up listener for profile changes
  useEffect(() => {
    const uid = authData.id;
    if (!uid || profileSub.current) return;

    profileSub.current = supabaseClient
      .from(`profiles:id=eq.${uid}`)
      .on("UPDATE", (payload) => {
        setAuthLoading(true);
        setAuthData(parseProfile(payload.new));
        setAuthLoading(false);
      })
      .subscribe();
  }, [authData, setAuthLoading, setAuthData]);

  return (
    <ToastProvider>
      <Routes />
    </ToastProvider>
  );
}

export default App;
