import PropTypes from "prop-types";

// @emotion/css
import { css } from "@emotion/css";

// styles
import styles from "./tab.module.css";

function Tab({ onClick, value, active }) {
  return (
    <button
      onClick={() => onClick(value.label)}
      type="button"
      className={`${styles.buttonTab} ${css({
        background: value.color,
      })}`}
    >
      <span className={`${styles.label}`}>{value.label}</span>
      <div
        className={`${styles.background} ${
          active === value.label ? "!h-[0%]" : ""
        }`}
      ></div>
    </button>
  );
}

Tab.propTypes = {
  onClick: PropTypes.func,
  active: PropTypes.string,
  value: PropTypes.shape({
    label: PropTypes.string,
    color: PropTypes.string,
    query: PropTypes.shape({
      attribute: PropTypes.string,
      operator: PropTypes.string,
      value: PropTypes.any,
    }),
  }),
};

export default Tab;
