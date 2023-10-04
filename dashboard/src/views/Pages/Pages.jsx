import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink, faGear } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

// config
import config from "../../config";

function Pages() {
  const { languageState } = useLanguage();

  const { pages } = useMemo(() => languageState.texts, [languageState]);

  const [visits, setVisits] = useState({});
  const [rebounds, setRebounds] = useState({});

  const pageRows = useMemo(() => {
    return pages.pages.map((page) => (
      <tr key={page.id}>
        <td colSpan="2">{page.title}</td>
        <td className="w-[100px]">{visits[page.url] || 0}</td>
        <td className="w-[100px]">{visits[page.url] || 0}</td>
        <td>
          <div className="flex items-center gap-3">
            <Link className="hover:text-primary" to={`/pages/${page.editLink}`}>
              <FontAwesomeIcon icon={faGear} />
            </Link>
            <a
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
              href={`${config.webUrl}${page.url}`}
            >
              <FontAwesomeIcon icon={faExternalLink} />
            </a>
          </div>
        </td>
      </tr>
    ));
  }, [pages]);

  return (
    <section className="w-full">
      <h2>{pages.title}</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th colSpan="2"></th>
            <th>{pages.columns.visits}</th>
            <th>{pages.columns.rebounds}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{pageRows}</tbody>
      </table>
    </section>
  );
}

export default Pages;
