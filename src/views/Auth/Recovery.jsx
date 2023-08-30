import { useEffect, useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useUser } from "../../contexts/UserProvider";
import { useLanguage } from "../../contexts/LanguageProvider";

// components
import SimpleInput from "../../components/SimpleInput/SimpleInput";

// styles
import styles from "./recovery.module.css";

function Recovery() {
  const { languageState } = useLanguage();

  const { auth, buttons } = useMemo(() => {
    return {
      auth: languageState.texts.auth,
      buttons: languageState.texts.buttons,
    };
  }, [languageState]);

  const [email, setEmail] = useState("");
  const [emailHelperText, setEmailHelperText] = useState("");

  const handleEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const navigate = useNavigate();

  const { userState } = useUser();

  useEffect(() => {
    if (userState.user) navigate("/");
  });

  return (
    <form
      className={`entrance dark:bg-dark-background bg-light-background2 ${styles.main}`}
    >
      <h2>{auth.recoveryTitle}</h2>
      <SimpleInput
        id="email"
        className="input-control"
        label={auth.labels.email}
        inputProps={{
          className: "input primary !pl-8 w-full",
          value: email,
          onChange: handleEmail,
          type: "string",
        }}
        leftIcon={
          <FontAwesomeIcon
            className="absolute text-white top-[50%] -translate-y-[50%] left-3"
            icon={faEnvelope}
          />
        }
        helperText={emailHelperText}
      />
      <div className="flex gap-2 justify-end w-full">
        <button type="submit" className="button primary self-end">
          {buttons.send}
        </button>
      </div>
    </form>
  );
}

export default Recovery;
