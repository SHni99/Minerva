import { useState, useContext, useEffect, useRef } from "react";
import Routes from "./Routes";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import AuthContext from "util/AuthContext";
import { supabaseClient } from "config/supabase-client";

function App() {
  // ================= Set up for global site Toast ===================
  // States for Toast
  const defaultToastOptions = {
    show: false,
    closeButton: false,
    position: "bottom-end",
    containerClasses: "p-4",
    variant: "light",
    autohide: true,
    delay: 2000,
    headerContent: "",
    bodyContent: "",
  };
  const [toastOptions, setToastOptions] = useState(defaultToastOptions);
  const {
    show,
    position,
    containerClasses,
    variant,
    autohide,
    delay,
    headerContent,
    bodyContent,
    closeButton,
  } = toastOptions;
  // ========================== End of global Toast ==========================
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
    <>
      <Routes setToastOptions={setToastOptions} />
      <ToastContainer
        position={position}
        className={"position-fixed " + containerClasses}
      >
        <Toast
          bg={variant}
          autohide={autohide}
          delay={delay}
          show={show}
          onClose={() => setToastOptions((old) => ({ ...old, show: false }))}
        >
          <Toast.Header closeButton={closeButton}>{headerContent}</Toast.Header>
          <Toast.Body>{bodyContent}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default App;
