import { useEffect, useState } from "react";
import Routes from "./Routes";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { supabaseClient } from "config/supabase-client";

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
