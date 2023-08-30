import React, { useState } from "react";

import "./styles.css";

function LazyImage(props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={props.styles}
      className={`${!loaded ? "box" : null} ${props.className} `}
    >
      <img onLoad={() => setLoaded(true)} {...props} alt={props.alt} />
    </div>
  );
}

export default LazyImage;
