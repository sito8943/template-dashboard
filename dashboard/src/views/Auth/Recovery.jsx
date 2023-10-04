import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

// contexts
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

  return (
    <form
      className={`entrance dark:bg-dark-background bg-light-background2 ${styles.main}`}
    >
      <h2 className="text-4xl">{auth.recoveryTitle}</h2>
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
        <button
          type="submit"
          name="send-password-recovery"
          className="button primary submit self-end"
          aria-label={languageState.texts.ariaLabels.recoverySend}
        >
          {buttons.send}
        </button>
        <Link
          name="login"
          to="/auth/"
          className="button secondary self-end hover:bg-pdark hover:border-pdark cursor-default"
          aria-label={languageState.texts.ariaLabels.login}
        >
          {languageState.texts.buttons.login}
        </Link>
      </div>
    </form>
  );
}

export default Recovery;
