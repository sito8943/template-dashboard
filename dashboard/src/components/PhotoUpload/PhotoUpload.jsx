import { useRef, useCallback, useState, useMemo } from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// images
import noPhoto from "../../assets/images/no-product.jpg";

// components
import Loading from "../Loading/Loading";

// config
import config from "../../config";

function PhotoUpload({ id, className, imgClassName, label, value, onChange }) {
  const inputRef = useRef(null);

  const handleClick = useCallback(() => {
    if (inputRef !== null) inputRef.current.click();
  }, [inputRef]);

  const [loading, setLoading] = useState(true);

  const photo = useMemo(() => {
    if (value) {
      if (value.length) return `${config.apiPhoto}${value}`;
      return value.blob;
    }
    return noPhoto;
  }, [value]);

  return (
    <div className={className}>
      {label ? <label htmlFor={id}>{label}</label> : null}
      <input ref={inputRef} className="absolute" type="file" onChange={(e) => onChange(id, e)} />
      {loading ? (
        <Loading className="absolute top-0 left-0 w-full h-full bg-dark-background2" />
      ) : null}
      <div className="group w-full h-full relative">
        <div className="pointer-events-none opacity-0 group-hover:opacity-[1] transition w-full h-full absolute flex items-center justify-center top-0 left-0 bg-dark-drawer-background">
          <FontAwesomeIcon icon={faAdd} className="text-4xl !text-white" />
        </div>
        <img
          loading="lazy"
          alt="model-photo"
          className={`w-full h-full object-cover ${imgClassName}`}
          onClick={handleClick}
          onLoad={() => setLoading(false)}
          src={photo}
        />
      </div>
    </div>
  );
}

PhotoUpload.defaultProps = {
  value: "",
};

PhotoUpload.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  imgClassName: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default PhotoUpload;
