import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useCallback, useMemo, useState } from "react";
import { baseUrl, postRequest } from "@/utils/services";
import { useAuth } from "@/context/AuthContext";
import { Loader2, LogIn, UserRoundPlus } from "lucide-react";

const AuthLayout = ({ formType }) => {
  const initStateFormSignIn = useMemo(() => ({ email: "", password: "" }), []);
  const initStateFormSignUp = useMemo(
    () => ({
      name: "",
      email: "",
      password: "",
      confPassword: "",
    }),
    []
  );

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [formSignIn, setFormSignIn] = useState(initStateFormSignIn);
  const [formSignUp, setFormSignUp] = useState(initStateFormSignUp);
  const [authLoading, setAuthLoading] = useState(false);
  const [validationError, setValidationError] = useState([]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setAuthLoading(true);
      setValidationError([]);
      try {
        if (formType === "signin") {
          const response = await postRequest(
            `${baseUrl}/users/login`,
            JSON.stringify(formSignIn)
          );
          if (response.success === false)
            return setValidationError((prev) => [prev, response.msg]);
          console.log({ response });
          localStorage.setItem("User", JSON.stringify(response.data));
          setFormSignIn(initStateFormSignIn);
          return setUser(response.data);
        } else {
          const response = await postRequest(
            `${baseUrl}/users/register`,
            JSON.stringify(formSignUp)
          );
          setFormSignUp(initStateFormSignUp);
          console.log({ response });
          navigate("/signin");
        }
      } catch (error) {
        console.log({ error });
        return null;
      } finally {
        setAuthLoading(false);
      }
    },
    [formSignIn, formSignUp]
  );

  return (
    <div className="w-full h-full flex flex-col items-center">
      <CardHeader className="flex flex-col justify-center items-center">
        <CardTitle>{formType === "signin" ? "SIGN IN" : "SIGN UP"}</CardTitle>
        {formType === "signin" && validationError.length > 0 && (
          <p className="text-sm text-rose-700 capitalize">{validationError}</p>
        )}
      </CardHeader>
      <form onSubmit={handleSubmit} className="w-full h-full">
        <CardContent className="flex flex-col gap-y-5">
          {formType === "signup" && (
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                type="name"
                id="name"
                placeholder="Name"
                value={formSignUp.name}
                onChange={(e) =>
                  setFormSignUp((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
          )}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              value={
                formType === "signin" ? formSignIn.email : formSignUp.email
              }
              onChange={(e) =>
                formType === "signin"
                  ? setFormSignIn((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  : setFormSignUp((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
              }
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              value={
                formType === "signin"
                  ? formSignIn.password
                  : formSignUp.password
              }
              onChange={(e) =>
                formType === "signin"
                  ? setFormSignIn((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  : setFormSignUp((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
              }
              required
            />
          </div>
          {formType === "signup" && (
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="confPassword">Password Confirmation</Label>
              <Input
                type="password"
                id="confPassword"
                placeholder="Password Confirmation"
                value={formSignUp.confPassword}
                onChange={(e) =>
                  setFormSignUp((prev) => ({
                    ...prev,
                    confPassword: e.target.value,
                  }))
                }
                required
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          {formType === "signin" ? (
            <p className="text-xs">
              What do you mean you don&apos;t have an account? Come on,{" "}
              <Link
                to="/signup"
                className="text-sm text-primary font-medium capitalize"
              >
                signup now
              </Link>
            </p>
          ) : (
            <p className="text-xs">
              Now that you have an account, let&apos;s{" "}
              <Link
                to="/signin"
                className="text-sm text-primary font-medium capitalize"
              >
                signin now
              </Link>
            </p>
          )}
          <Button
            type="submit"
            className="mt-2 flex flex-row justify-center items-center gap-x-2"
            disabled={authLoading}
          >
            {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {formType === "signin" ? (
              <LogIn size={16} />
            ) : (
              <UserRoundPlus size={16} />
            )}
            {formType === "signin" ? "SIGN IN NOW" : "SIGN UP NOW"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
};
AuthLayout.propTypes = {
  formType: PropTypes.oneOf(["signin", "signup"]),
};

export default AuthLayout;
