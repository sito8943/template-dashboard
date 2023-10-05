import React, { useCallback, useEffect, useMemo, useState } from "react";
import Tippy from "@tippyjs/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";

function ClientSays() {
  const { languageState } = useLanguage();

  const { clientSays } = useMemo(
    () => languageState.texts.pages.home,
    [languageState]
  );

  const [allComments, setAllComments] = useState([]);

  const fetch = useCallback(() => {}, []);

  useEffect(() => {
    // load client comments
    fetch();
  }, []);

  const printComments = useMemo(() => {}, [allComments]);

  return (
    <article id="clientSays">
      <h3>
        {clientSays.title}{" "}
        <span>
          <Tippy content={clientSays.description}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </Tippy>
        </span>
      </h3>
      <div className="flex gap-2">{printComments}</div>
    </article>
  );
}

export default ClientSays;
