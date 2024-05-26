import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
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

  useEffect(() => {
    const user = localStorage.getItem("User");

    setUser(JSON.parse(user));
  }, []);

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

      setUser(response);
    },
    [registerInfo]
  );

  const updateRegisterInfo = useCallback(
    (info) => {
      setRegisterInfo({ ...registerInfo, ...info });
    },
    [registerInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          user,
          registerInfo,
          updateRegisterInfo,
          registerUser,
          registerError,
          isRegisterLoading,
          logoutUser,
        }),
        [
          user,
          registerInfo,
          updateRegisterInfo,
          registerUser,
          registerError,
          isRegisterLoading,
          logoutUser,
        ]
      )}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
