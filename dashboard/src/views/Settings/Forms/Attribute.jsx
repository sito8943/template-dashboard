import { memo, useMemo, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useNotification } from "../../../contexts/NotificationProvider";

// services
import { fetchList } from "../../../services/get";
import { saveModel } from "../../../services/post";

// utils
import { getUserName, getUserId } from "../../../utils/auth";

// components
import Loading from "../../../components/Loading/Loading";
import SimpleInput from "../../../components/SimpleInput/SimpleInput";

function Attribute({ attribute }) {
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const showNotification = useCallback(
    (ntype, message) =>
      setNotificationState({
        type: "set",
        ntype,
        message,
      }),
    [setNotificationState]
  );

  const { settings, errors, buttons, messages } = useMemo(() => {
    return {
      settings: languageState.texts.settings,
      buttons: languageState.texts.buttons,
      security: languageState.texts.settings.security,
      messages: languageState.texts.messages,
      errors: languageState.texts.errors,
    };
  }, [languageState]);

  const [oldAttribute, setOldAttribute] = useState("");
  const [attributeV, setAttributeV] = useState("");
  const [attributeHelperText, setAttributeHelperText] = useState("");

  const [loading, setLoading] = useState(false);

  const handleAttribute = useCallback((e) => setAttributeV(e.target.value), []);

  const onSubmit = useCallback(
    async (e) => {
      setLoading(true);
      setAttributeHelperText("");
      e.preventDefault();
      // validating length
      if (!attributeV.length) {
        document.getElementById(attribute)?.focus();
        setAttributeHelperText(errors.attributeRequired);
        setLoading(false);
        return;
      }
      // validating equality with old one
      if (attributeV === oldAttribute) {
        document.getElementById(attribute)?.focus();
        setAttributeHelperText(errors.attributesEqual);
        setLoading(false);
        return;
      }
      try {
        const data = {};
        data[attribute] = attributeV;
        await saveModel("users", { ...data, id: getUserId() });
        showNotification("success", messages.saved);
      } catch (err) {
        console.error(err);
        if (String(err) === "AxiosError: Network Error")
          showNotification("error", errors.notConnected);
        else showNotification("error", String(err));
      }
      setLoading(false);
    },
    [attribute, attributeV, oldAttribute, errors, messages, showNotification]
  );

  const fetchAttribute = useCallback(async () => {
    try {
      const response = await fetchList("users", 0, [attribute], {
        attribute: "user",
        operator: "=",
        value: getUserName(),
      });
      const { list } = await response.data;
      const data = list[0];
      setOldAttribute(data[attribute]);
      setAttributeV(data[attribute]);
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", errors.notConnected);
      else showNotification("error", String(err));
    }
  }, [attribute, errors, showNotification]);

  useEffect(() => {
    fetchAttribute();
  }, []);

  return (
    <form onSubmit={onSubmit} className="relative">
      {loading ? (
        <Loading className="w-full h-full absolute top-0 left-0 dark:bg-dark-background bg-light-background z-20" />
      ) : null}
      <div className="flex items-center gap-2 mb-5">
        <h3>{settings[attribute]?.title}</h3>
      </div>
      <SimpleInput
        id={attribute}
        className="input-control"
        label={settings[attribute]?.label}
        inputProps={{
          className: "input primary w-full",
          value: attributeV,
          onChange: handleAttribute,
          type: attribute,
        }}
        helperText={attributeHelperText}
      />
      <button
        type="submit"
        name={`save-${attribute}`}
        className="primary button submit mt-2"
        aria-label={`${languageState.texts.ariaLabels.saveAttribute} ${attribute}`}
      >
        {buttons.save}
      </button>
    </form>
  );
}

Attribute.propTypes = {
  attribute: PropTypes.string.isRequired,
};

const AttributeMemo = memo(
  (props) => <Attribute {...props} />,
  (oldProps, newProps) => {
    return oldProps.attribute === newProps.attribute;
  }
);

AttributeMemo.displayName = "Attribute";

export default AttributeMemo;
