import { useState, useEffect } from "react";
import Routes from "./Routes";
import { supabaseClient } from "./config/supabase-client";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

function App() {
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

  const [blockedArray, setBlockedArray] = useState("");

  useEffect(() => {
    const getBlockedStatus = async () => {
      try {
        const user = supabaseClient.auth.user();
        const { data: blockedData, error } = await supabaseClient
          .from("profiles")
          .select("blocked")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setBlockedArray(blockedData.blocked);
      } catch (error) {
        alert(error.message);
      }
    };
    getBlockedStatus();
  }, []);

  return (
    <>
      <Routes setToastOptions={setToastOptions} blockedArray={blockedArray} 
      setBlockedArray={setBlockedArray} />
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
