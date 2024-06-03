import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import { ChatContextProvider } from "./context/ChatContext";
import { useAuth } from "./context/AuthContext";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import ProtectedRoute from "./ProtectedRoute";
import Modal from "./components/Modal";
import { useModal } from "./context/ModalContext";

function App() {
  const { user } = useAuth();
  const { modalInfo, closeModal } = useModal();
  const { open, status, messages } = modalInfo;
  console.log({ modalInfo });

  return (
    <ChatContextProvider user={user}>
      <NavBar />
      <Routes>
        <Route path="/" element={<ProtectedRoute pages={<Chat />} />} />
        <Route path="/tes" element={<Modal />} />
        <Route
          path="/signin"
          element={<ProtectedRoute pages={<Auth formType="signin" />} />}
        />
        <Route
          path="/signup"
          element={
            <ProtectedRoute
              pages={<Auth formType="signup" />}
              navigateTo="/signup"
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Modal
        open={open}
        onClose={closeModal}
        status={status}
        messages={messages}
      />
    </ChatContextProvider>
  );
}

export default App;
