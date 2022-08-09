import { createContext, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
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

  // Simplify toast showing
  const showSimpleToast = (title, message, timeout) =>
    setToastOptions({
      show: true,
      closeButton: false,
      position: "bottom-end",
      containerClasses: "p-4",
      variant: "light",
      autohide: true,
      delay: timeout,
      headerContent: title,
      bodyContent: message,
    });

  return (
    <ToastContext.Provider value={{ setToastOptions, showSimpleToast }}>
      {children}
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
    </ToastContext.Provider>
  );
};

export default ToastContext;
