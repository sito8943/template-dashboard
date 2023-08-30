import { useCallback, useState } from "react";
import PropTypes from "prop-types";

// components
import Tab from "./Tab";

function Tabs({ tabs, onChange }) {
  const [active, setActive] = useState("");

  const onLocalChange = useCallback(
    (newValue) => {
      if (active === newValue) {
        setActive("");
        onChange("");
      } else {
        setActive(newValue);
        onChange(newValue);
      }
    },
    [onChange, active]
  );

  return (
    <div className="mt-5">
      {tabs.map((tab, i) => (
        <Tab onClick={onLocalChange} key={i} value={tab} active={active} />
      ))}
    </div>
  );
}

Tabs.propTypes = {
  onChange: PropTypes.func,
  tabs: PropTypes.array,
};

export default Tabs;
