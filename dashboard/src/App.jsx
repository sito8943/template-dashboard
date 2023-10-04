import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import loadable from "@loadable/component";

import io from "socket.io-client";

// some-javascript-utils
import { getUserLanguage } from "some-javascript-utils/browser";

// layouts
import Auth from "./layouts/Auth";
import View from "./layouts/View/View";
import Model from "./layouts/Model/Model";

// views
import NotFound from "./views/NotFound/NotFound";
import Settings from "./views/Settings/Settings";
import Recovery from "./views/Auth/Recovery";
import SignOut from "./views/Auth/SignOut";
import SignIn from "./views/Auth/SignIn";
import Pages from "./views/Pages/Pages";
import Home from "./views/Home/Home";
import HomePage from "./views/Pages/HomePage";

// contexts
import { useMode } from "./contexts/ModeProvider";
import { useUser } from "./contexts/UserProvider.jsx";
import { useLanguage } from "./contexts/LanguageProvider";
import { useNotification } from "./contexts/NotificationProvider";

// utils
import { logoutUser, userLogged, fromLocal, getUserName } from "./utils/auth";

// services
import { validateBasicKey } from "./services/auth";

import config from "./config";

// components
import List from "./layouts/Model/components/List";
import Form from "./layouts/Model/components/Form";
import Loading from "./components/Loading/Loading";

// lazy
const Notification = loadable(() =>
  import("./components/Notification/Notification")
);

function App() {
  const { setModeState } = useMode();

  const { setLanguageState } = useLanguage();
  const { setNotificationState } = useNotification();
  const { userState, setUserState } = useUser();

  const [loading, setLoading] = useState(true);

  const showNotification = useCallback(
    (ntype, message) =>
      setNotificationState({
        type: "set",
        ntype,
        message,
      }),
    [setNotificationState]
  );

  const fetch = async () => {
    try {
      const value = await validateBasicKey();
      if (!value) logoutUser();
      else setUserState({ type: "logged-in", user: fromLocal() });
      setLoading(false);
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        return showNotification("error", errors.notConnected);
      const { response } = err;
      if (response) {
        const { status } = response;
        switch (status) {
          case 403:
          case 401:
            logoutUser();
            break;
          default:
            showNotification("error", String(err));
            break;
        }
      } else showNotification("error", String(err));
      showNotification("error", String(err));
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
    else setLoading(false);
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
      {!loading ? (
        <BrowserRouter>
          <Routes>
            <Route exact path="/auth" element={<Auth />}>
              <Route index element={<SignIn />} />
              <Route exact path="/auth/recovery" element={<Recovery />} />
            </Route>
            <Route exact path="/" element={<View />}>
              <Route index element={<Home />} />
              <Route
                exact
                path="/pages/"
                element={
                  <main className="main-model bg-light-background dark:bg-dark-background w-full rounded-s-xl h-full p-5 relative overflow-auto">
                    <Outlet />
                  </main>
                }
              >
                <Route index element={<Pages />} />
                <Route exact path="/pages/home/" element={<HomePage />} />
                <Route index element={<Pages />} />
              </Route>
              <Route path="/:collection/" element={<Model />}>
                <Route index element={<List />} />
                <Route path="/:collection/:id" element={<Form />} />
              </Route>
              <Route exact path="/settings/" element={<Settings />} />
            </Route>
            <Route exact path="/sign-out" element={<SignOut />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <Loading className="w-full h-screen fixed top-0 left-0 z-40" />
      )}
    </div>
  );
}

export default App;
