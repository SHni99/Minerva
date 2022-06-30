import Routes from "./Routes";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

function App() {
  return (
    <>
      <Routes />
      <ToastContainer position="bottom-end" className="position-fixed">
        <Toast>
          <Toast.Header>hi</Toast.Header>
          <Toast.Body>Hi</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default App;
