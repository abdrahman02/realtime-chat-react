import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import PropTypes from "prop-types";

const ProtectedRoute = ({ pages, navigateTo = "/signin" }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    } else {
      navigate(navigateTo);
    }
  }, [user, navigate]);

  return user ? null : pages;
};
ProtectedRoute.propTypes = {
  pages: PropTypes.node.isRequired,
  navigateTo: PropTypes.string,
};

export default ProtectedRoute;
