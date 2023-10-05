import { useMemo } from "react";

// components
import LazyImage from "../LazyImage/LazyImage";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

// images
import noProduct from "../../assets/images/no-product.jpg";

// config
import config from "../../config";

function PhotoUploadSubmit({ id, value, onChange }) {
  const { languageState } = useLanguage();

  const { buttons } = useMemo(() => languageState.texts, [languageState]);

  const photo = useMemo(() => {
    if (value) {
      if (value.length) return `${config.apiPhoto}${value}`;
      return value.blob;
    }
    return noProduct;
  }, [value]);

  return (
    <div className="flex gap-5 items-center justify-start">
      <LazyImage
        className="h-[150px] w-[150px] my-3 rounded-full object-cover"
        src={photo}
        alt={`${id} image`}
      />
      <label className="primary submit rounded-3xl w-[180px] h-[45px] flex items-center justify-center text-center relative">
        {buttons.uploadPhoto}
        <input
          id={id}
          type="file"
          accept="image/*"
          className="absolute"
          onChange={onChange}
        />
      </label>
    </div>
  );
}

export default PhotoUploadSubmit;
