import { useEffect, useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createCookie } from "some-javascript-utils/browser";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen, faUser } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useUser } from "../../contexts/UserProvider";
import { useLanguage } from "../../contexts/LanguageProvider";
import { useNotification } from "../../contexts/NotificationProvider";

// components
import Switch from "../../components/Switch/Switch";
import Loading from "../../components/Loading/Loading";
import SimpleInput from "../../components/SimpleInput/SimpleInput";

// services
import { login } from "../../services/auth";

// utils
import { logUser } from "../../utils/auth";

import config from "../../config";

// images
import noPhoto from "../../assets/images/no-photo.webp";

// styles
import styles from "./signIn.module.css";

function SignIn() {
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const { auth, errors } = useMemo(() => {
    return {
      auth: languageState.texts.auth,
      errors: languageState.texts.errors,
    };
  }, [languageState]);

  const [user, setUser] = useState("");
  const [userHelperText, setUserHelperText] = useState("");

  const handleUser = useCallback((e) => {
    setUser(e.target.value);
  }, []);

  const [remember, setRemember] = useState(false);

  const handleRemember = useCallback(() => {
    setRemember(!remember);
  }, [remember]);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState("");

  const handlePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const navigate = useNavigate();

  const { userState, setUserState } = useUser();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userState.user) navigate("/");
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [userState]);

  const showNotification = useCallback(
    (ntype, message) =>
      setNotificationState({
        type: "set",
        ntype,
        message,
      }),
    [setNotificationState]
  );

  const onSubmit = useCallback(
    async (e) => {
      setUserHelperText("");
      setPasswordHelperText("");
      e.preventDefault();
      if (!user.length) {
        document.getElementById("user")?.focus();
        setUserHelperText(errors.userRequired);
        return;
      }
      if (!password.length) {
        document.getElementById("password")?.focus();
        setPasswordHelperText(errors.passwordRequired);
        return;
      }
      try {
        setLoading(true);
        const response = await login(user, password, remember);
        const { data } = response;
        const { expiration, token, state, permissions } = data;
        createCookie(config.basicKey, expiration, token);
        console.log(config.apiPhoto, data.photo);
        logUser({
          id: data.id,
          user: data.user,
          photo: `${config.apiPhoto}${data.photo}` || noPhoto,
          state: data.state,
          permissions,
        });
        setUserState({
          type: "logged-in",
          user: {
            id: data.id,
            user: data.user,
            photo: `${config.apiPhoto}${data.photo}` || noPhoto,
            state,
            permissions,
          },
        });
        navigate("/");
      } catch (err) {
        console.error(err);
        const { response } = err;
        if (String(err) === "AxiosError: Network Error")
          showNotification("error", errors.notConnected);
        else if (response) {
          const { status } = response;
          switch (status) {
            case 403:
              showNotification("error", errors.accountAlreadyOpened);
              break;
            case 401:
              showNotification("error", errors.wrongCredentials);
              break;
          }
        } else showNotification("error", String(err));
      }
      setLoading(false);
    },
    [user, password, errors, showNotification, navigate, remember, setUserState]
  );

  return (
    <>
      {loading ? <Loading className="fixed-loading" /> : null}
      <form
        onSubmit={onSubmit}
        className={`entrance bg-light-background dark:bg-dark-background ${styles.main}`}
      >
        <h2>{auth.signIn.title}</h2>
        <SimpleInput
          id="user"
          className="input-control"
          label={auth.labels.user}
          inputProps={{
            className: "input primary !pl-8 w-full",
            value: user,
            onChange: handleUser,
            type: "string",
          }}
          leftIcon={
            <FontAwesomeIcon
              className="absolute text-white top-[50%] -translate-y-[50%] left-3"
              icon={faUser}
            />
          }
          helperText={userHelperText}
        />
        <SimpleInput
          id="password"
          className="input-control"
          label={auth.labels.password}
          inputProps={{
            className: "input primary !pl-8 w-full",
            value: password,
            onChange: handlePassword,
            type: !showPassword ? "password" : "string",
          }}
          leftIcon={
            <button
              tabIndex={-1}
              type="button"
              name="toggle-see-password"
              onClick={toggleShowPassword}
              aria-label={languageState.texts.ariaLabels.toggleShowPassword}
            >
              <FontAwesomeIcon
                icon={showPassword ? faLockOpen : faLock}
                className="absolute text-white top-[50%] -translate-y-[50%] left-3"
              />
            </button>
          }
          helperText={passwordHelperText}
        />
        <Switch
          id="remember"
          value={remember}
          onChange={handleRemember}
          label={auth.labels.remember}
        />
        <p>
          {auth.recovery.body}
          <Link
            name="go-recovery"
            to="/auth/recovery"
            aria-label={languageState.texts.ariaLabels.goRecovery}
            className="ml-1 underline dark:text-white text-dark-background2"
          >
            {auth.recovery.link}
          </Link>
          .
        </p>
        <div className="w-full flex gap-5 justify-end items-center">
          <button
            name="login"
            type="submit"
            aria-label={languageState.texts.ariaLabels.login}
            className="button primary self-end hover:bg-pdark hover:border-pdark cursor-default"
          >
            {auth.signIn.submit}
          </button>
        </div>
      </form>
    </>
  );
}

export default SignIn;
