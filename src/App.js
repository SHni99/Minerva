import { useState, useContext, useEffect } from "react";
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
  const { authData, setAuthData } = useContext(AuthContext);

  // Set up onAuthStateChange listener, only done once at the start.
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

    const parseSession = async (session) => {
      if (!session)
        return {
          logged_in: false,
          permissions: 0,
          is_banned: false,
          username: null,
          avatar_url: null,
          id: null,
        };

      const { user } = session;

      const { id, username, avatar_url, permissions } = await getAccountData(
        user?.id
      );
      return {
        logged_in: true,
        username,
        permissions,
        is_banned: permissions < 0,
        avatar_url,
        id,
      };
    };

    supabaseClient.auth.onAuthStateChange(async (_, session) => {
      setAuthData(await parseSession(session));
    });
  }, [setAuthData]);

  // Also set up listener for profile changes
  useEffect(() => {
    const uid = authData.id;
    if (!uid) return;
    const profileSub = supabaseClient
      .from(`profiles:id=eq.${uid}`)
      .on("UPDATE", (payload) => {
        const { id, username, avatar_url, permissions } = payload?.new;
        setAuthData({
          logged_in: true,
          username,
          permissions,
          is_banned: permissions < 0,
          avatar_url,
          id,
        });
      })
      .subscribe();
    return () => supabaseClient.removeSubscription(profileSub);
  }, [authData, setAuthData]);

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
