import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import loadable from "@loadable/component";

import io from "socket.io-client";

// some-javascript-utils
import { getUserLanguage } from "some-javascript-utils/browser";

// layouts
import View from "./layouts/View";
import Auth from "./layouts/Auth";

// views
import NotFound from "./views/NotFound/NotFound";
import Settings from "./views/Settings/Settings";
import Recovery from "./views/Auth/Recovery";
import SignOut from "./views/Auth/SignOut";
import SignIn from "./views/Auth/SignIn";
import Users from "./views/Users/Users";
import Home from "./views/Home/Home";

// contexts
import { useMode } from "./contexts/ModeProvider";
import { useUser } from "./contexts/UserProvider.jsx";
import { useLanguage } from "./contexts/LanguageProvider";

// utils
import { logoutUser, userLogged, fromLocal, getUserName } from "./utils/auth";

// services
import { validateBasicKey } from "./services/auth";

import config from "./config";

// lazy
const Notification = loadable(() =>
  import("./components/Notification/Notification")
);

function App() {
  const { setModeState } = useMode();

  const { setLanguageState } = useLanguage();
  const { userState, setUserState } = useUser();

  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const value = await validateBasicKey();
      if (!value) {
        logoutUser();
      } else setUserState({ type: "logged-in", user: fromLocal() });
    } catch (err) {
      if (String(err) !== "AxiosError: Network Error") {
        logoutUser();
      }
    }
  };

  useEffect(() => {
    try {
      setLanguageState({ type: "set", lang: getUserLanguage(config.language) });
    } catch (err) {
      console.error(err);
    }
    try {
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        localStorage.setItem("theme", "dark");
        setModeState({ type: "set", to: false });
      } else {
        document.documentElement.classList.add("list");
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        setModeState({ type: "set", to: true });
      }
    } catch (err) {
      console.error(err);
    }

    if (userLogged()) fetch();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (
      userState.user &&
      (!userState.socket || (userState.socket && !userState.socket.connected))
    ) {
      const newSocket = io(config.apiSocket, { transports: ["polling"] });

      newSocket.on("connect", () => {
        console.info("connect", getUserName());
        newSocket.emit("send-user-id", getUserName());
      });
      newSocket.on("user-logged", (options) => {
        const { date } = options;
        localStorage.setItem("date", date);
      });
      newSocket.on("plus-minute", (date) => {
        localStorage.setItem("date", date);
      });
      setUserState({ type: "socket", socket: newSocket });
      return () => {
        newSocket.close();
      };
    }
  }, [userState.user, setUserState]);

  return (
    <div className="w-full min-h-screen dark:bg-dark-background2 bg-light-background2 transition">
      <Notification />
      <BrowserRouter>
        <Routes>
          <Route exact path="/auth" element={<Auth />}>
            <Route index element={<SignIn />} />
            <Route exact path="/auth/recovery" element={<Recovery />} />
          </Route>
          <Route exact path="/" element={<View />}>
            <Route index element={<Home />} />
            <Route exact path="/users/*" element={<Users />} />
            <Route exact path="/settings/" element={<Settings />} />
          </Route>
          <Route exact path="/sign-out" element={<SignOut />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
