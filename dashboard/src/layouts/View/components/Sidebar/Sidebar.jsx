import { useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTextHeight,
  faFileText,
  faHome,
  faUser,
  faGear,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

// contexts
import { useUser } from "../../../../contexts/UserProvider";
import { useLanguage } from "../../../../contexts/LanguageProvider";

// utils
import { getUserPermissions } from "../../../../utils/auth";

// styles
import styles from "./styles.module.css";

function Sidebar() {
  const location = useLocation();

  const { userState } = useUser();

  const { languageState } = useLanguage();

  const icons = useMemo(
    () => ({
      home: faHome,
      users: faUser,
      pages: faFileText,
      settings: faGear,
      logout: faArrowRightFromBracket,
    }),
    []
  );

  const printActions = useCallback(() => {
    const parsedLocation = location.pathname.split("/");

    return languageState.texts.sidebar.actions
      .filter((operation) => {
        if (operation.all) return true;
        if (userState.user)
          return getUserPermissions().indexOf(operation.id) >= 0;
      })
      .map((action) => (
        <Link
          to={action.to}
          key={action.id}
          className={`${
            `/${parsedLocation[1]}` === action.to ||
            `/${parsedLocation[1]}/` === action.to
              ? "text-white bg-primary"
              : "dark:text-white hover:text-white hover:bg-primary"
          }  flex items-center gap-3 justify-start transition py-2 px-2`}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <FontAwesomeIcon className="text-md" icon={icons[action.id]} />
          </div>
          <span>{action.label}</span>
        </Link>
      ));
  }, [languageState, icons, location, userState]);

  return (
    <aside className={`${styles.sidebar}`}>
      <div className="flex flex-col">{printActions()}</div>
    </aside>
  );
}

export default Sidebar;
