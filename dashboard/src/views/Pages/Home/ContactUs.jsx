import React, { useCallback, useEffect, useMemo, useState } from "react";
import Tippy from "@tippyjs/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// components
import Loading from "../../../components/Loading/Loading";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useNotification } from "../../../contexts/NotificationProvider";
import { fetchList } from "../../../services/get";

function ContactUs() {
  const { languageState } = useLanguage();

  const { contactUs } = useMemo(
    () => languageState.texts.pages.home,
    [languageState]
  );

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [loading, setLoading] = useState(true);

  const [socialMedia, setSocialMedia] = useState([]);

  const fetchSocialMedia = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchList("socialMedia", 0, ["id", "url"]);
      const { list } = await response.json();
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", errors.notConnected);
      else showNotification("error", String(err));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // load image and socialMedia
    fetchSocialMedia();
  }, []);

  return (
    <article id="contactUs">
      <h3>
        {contactUs.title}{" "}
        <span>
          <Tippy content={contactUs.description}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </Tippy>
        </span>
      </h3>
    </article>
  );
}

export default ContactUs;
