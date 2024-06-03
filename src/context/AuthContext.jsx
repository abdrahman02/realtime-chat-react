import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import PropTypes from "prop-types";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    let user = localStorage.getItem("User");
    if (user) {
      user = JSON.parse(user);
      setUser(user.data);
    }
  }, []);

  // REGISTER
  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);

      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );

      setIsRegisterLoading(false);

      if (response.success === false) return setRegisterError(response.msg);

      localStorage.setItem("User", JSON.stringify(response));

      setUser(response.data);
    },
    [registerInfo]
  );
  const updateRegisterInfo = useCallback(
    (info) => {
      setRegisterInfo({ ...registerInfo, ...info });
    },
    [registerInfo]
  );

  // LOGIN
  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);

      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );

      setIsLoginLoading(false);

      if (response.success === false) return setLoginError(response.msg);

      localStorage.setItem("User", JSON.stringify(response));

      setUser(response.data);
    },
    [loginInfo]
  );
  const updateLoginInfo = useCallback(
    (info) => {
      setLoginInfo({ ...loginInfo, ...info });
    },
    [loginInfo]
  );

  const value = {
    user,
    setUser,
    registerInfo,
    updateRegisterInfo,
    registerUser,
    registerError,
    isRegisterLoading,
    loginInfo,
    updateLoginInfo,
    loginUser,
    loginError,
    isLoginLoading,
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
