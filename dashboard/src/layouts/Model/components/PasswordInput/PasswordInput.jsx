import React, { useState } from "react";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLockOpen, faLock } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../../../contexts/LanguageProvider";

// components
import SimpleInput from "../../../../components/SimpleInput/SimpleInput";

function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  helperText,
}) {
  const { languageState } = useLanguage();

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <SimpleInput
      id={id}
      className="input-control"
      label={label}
      inputProps={{
        className: "input primary !pl-8 w-full",
        value,
        onChange,
        type: !showPassword ? "password" : "string",
        placeholder,
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
            name="toggle-see-password"
            icon={showPassword ? faLockOpen : faLock}
            aria-label={languageState.texts.ariaLabels.toggleShowPassword}
            className="absolute text-white top-[50%] -translate-y-[50%] left-3"
          />
        </button>
      }
      helperText={helperText}
    />
  );
}

export default PasswordInput;
