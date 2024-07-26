import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import { ChatContextProvider } from "./context/ChatContext";
import { useAuth } from "./context/AuthContext";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function App() {
  const { user } = useAuth();

  return (
    <ChatContextProvider user={user}>
      <NavBar />
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Chat />} />} />
        <Route
          path="/signin"
          element={
            <PublicRoute
              restricted={true}
              element={<Auth formType="signin" />}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute
              restricted={true}
              element={<Auth formType="signup" />}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ChatContextProvider>
  );
}

export default App;
