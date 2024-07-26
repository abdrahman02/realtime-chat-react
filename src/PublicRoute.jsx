import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PropTypes from "prop-types";

const PublicRoute = ({ element, restricted }) => {
  const { user } = useAuth();

  return user && restricted ? <Navigate to="/" /> : element;
};
PublicRoute.propTypes = {
  element: PropTypes.node.isRequired,
  restricted: PropTypes.bool.isRequired,
};

export default PublicRoute;
