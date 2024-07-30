import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Loader2,
  LogIn,
  LogOut,
  MessagesSquare,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
// import Notification from "./chat/Notification";

const NavBar = () => {
  const { user, setUser, setToken } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);

  const signOut = () => {
    setAuthLoading(true);
    localStorage.removeItem("User");
    localStorage.removeItem("Token");
    setUser(null);
    setToken(null);
    setAuthLoading(false);
  };

  return (
    <header className="w-full h-14 md:h-16 flex flex-col justify-center items-center bg-primary text-primary-foreground">
      <div className="w-full h-full px-10 py-1 md:py-0 flex flex-row justify-between items-center">
        <span className="text-2xl font-geist-sans font-bold">
          <Link
            to="/"
            className="flex flex-row jusityf-center items-center gap-x-2"
          >
            <MessagesSquare />
            <p className="hidden md:block">chatApp.</p>
          </Link>
        </span>
        {user && (
          <span className="text-warning hidden md:block">
            {user ? `Logged in as ${user?.name}` : ""}
          </span>
        )}
        <nav>
          <ul className="flex flex-row items-center gap-x-5">
            {!user ? (
              <>
                <li>
                  <Button
                    className="flex flex-row justify-center items-center gap-x-2 border hover:bg-secondary hover:text-foreground"
                    asChild
                  >
                    <Link to="/signin">
                      <LogIn size={16} />
                      <p className="hidden md:block">Sign In</p>
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button
                    className="flex flex-row justify-center items-center gap-x-2"
                    variant="secondary"
                    asChild
                  >
                    <Link to="/signup">
                      <UserRoundPlus size={16} />
                      <p className="hidden md:block">Sign Up</p>
                    </Link>
                  </Button>
                </li>
              </>
            ) : (
              <>
                {/* <Notification /> */}
                <li>
                  <Button
                    className="flex flex-row justify-center items-center gap-x-2"
                    variant="secondary"
                    asChild
                    disabled={authLoading}
                  >
                    <Link to="/" onClick={signOut}>
                      {authLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut size={16} />
                      )}
                      <p className="hidden md:block">Sign Out</p>
                    </Link>
                  </Button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      <div className="w-full text-xs text-card-foreground text-center uppercase tracking-wide md:hidden bg-card">
        {user ? `Logged in as ${user?.name}` : ""}
      </div>
    </header>
  );
};

export default NavBar;
