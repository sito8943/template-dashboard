import React, { useState } from "react";

// images
import crash from "../../assets/images/crash.webp";

import "./styles.css";

function LazyImage(props) {
  const [loaded, setLoaded] = useState(false);

  const [error, setError] = useState(false);

  return (
    <div
      style={props.styles}
      className={`${!loaded ? "box" : null} ${props.className} `}
    >
      <img
        onError={(err) => {
          console.log(err);
          setError(true);
        }}
        onLoad={() => setLoaded(true)}
        {...props}
        src={error ? crash : props.src}
        alt={props.alt}
      />
    </div>
  );
}

export default LazyImage;
