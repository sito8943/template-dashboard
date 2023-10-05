import React, { useCallback, useEffect, useMemo } from "react";
import Tippy from "@tippyjs/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";

function ContactUs() {
  const { languageState } = useLanguage();

  const { contactUs } = useMemo(
    () => languageState.texts.pages.home,
    [languageState]
  );

  const fetch = useCallback(() => {}, []);

  useEffect(() => {
    // load image and socialMedia
    fetch();
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
