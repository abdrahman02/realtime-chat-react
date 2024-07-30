import {
  createContext,
  // useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import PropTypes from "prop-types";
// import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("User");
    const token = localStorage.getItem("Token");
    if (user) {
      setUser(JSON.parse(user));
      setToken(JSON.parse(token));
    }
  }, []);

  const value = {
    user,
    setUser,
    token,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthContextProvider");

  return context;
};
