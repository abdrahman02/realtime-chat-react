import AuthLayout from "@/components/layouts/AuthLayout";
import { Card } from "@/components/ui/card";
import PropTypes from "prop-types";

const Auth = ({ formType }) => {
  return (
    <main className="w-full h-[90vh] flex justify-center items-center">
      <Card className="w-1/3 shadow-md">
        <AuthLayout formType={formType} />
      </Card>
    </main>
  );
};
Auth.propTypes = {
  formType: PropTypes.oneOf(["signin", "signup"]),
};

export default Auth;
