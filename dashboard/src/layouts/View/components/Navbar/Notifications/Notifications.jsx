import React, { useEffect } from "react";

// components
import Notification from "./Notification";

// styles
import styles from "./styles.module.css";

function Notifications({ notifications, show, onClose }) {
  return (
    <div
      className={`${styles.main} ${
        show ? "opacity-[1]" : "opacity-0 pointer-events-none"
      } bg-light-background2 dark:bg-dark-background2`}
    ></div>
  );
}

export default Notifications;
