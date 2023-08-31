import { useState, useCallback, useMemo, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
// @emotion/css
import { css } from "@emotion/css";

// contexts
import { useUser } from "../../../contexts/UserProvider";
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useNotification } from "../../../contexts/NotificationProvider";

// services
import { fetchList } from "../../../services/get";
import { saveModel } from "../../../services/post";

// utils
import { getUserName, getUserId } from "../../../utils/auth";

// components
import Loading from "../../../components/Loading/Loading";
import PhotoUpload from "../../../components/PhotoUpload/PhotoUpload";

// styles
import styles from "./styles.module.css";

// config
import config from "../../../config";
function Photo({ model }) {
  const { setUserState } = useUser();
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const showNotification = useCallback(
    (ntype, message) =>
      setNotificationState({
        type: "set",
        ntype,
        message,
      }),
    [setNotificationState]
  );

  const { errors, messages } = useMemo(() => {
    return {
      messages: languageState.texts.messages,
      errors: languageState.texts.errors,
    };
  }, [languageState]);

  const [loading, setLoading] = useState(false);

  const fetchPhoto = useCallback(async () => {
    try {
      let response;
      if (model)
        response = await fetchList(model, 0, ["photo"], {
          attribute: "owner",
          operator: "=",
          value: getUserId(),
        });
      else
        response = await fetchList("users", 0, ["photo"], {
          attribute: "user",
          operator: "=",
          value: getUserName(),
        });
      const { list } = await response.data;
      const data = list[0];
      if (!model)
        setUserState({
          type: "set-photo",
          photo: `${config.apiPhoto}${data.photo}`,
        });
      setPhotos({
        type: "set",
        id: "photo",
        value: `${data.photo}`,
      });
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", errors.notConnected);
      else showNotification("error", String(err));
    }
  }, [errors, showNotification, model, setUserState]);

  const localSave = useCallback(
    async (photo) => {
      setLoading(true);
      try {
        if (model)
          await saveModel(
            model,
            { photo },
            { attribute: "owner", operator: "=", value: getUserId() }
          );
        else {
          await saveModel("users", { photo, id: getUserId() });
          setUserState({ type: "set-photo", photo: { blob: photo } });
        }
        /* await fetchPhoto(); */
        showNotification("success", messages.saved);
      } catch (err) {
        console.error(err);
        if (String(err) === "AxiosError: Network Error")
          showNotification("error", errors.notConnected);
        else showNotification("error", String(err));
      }
      setLoading(false);
    },
    [showNotification, errors, messages, setUserState, model]
  );

  const photoReducer = (old, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { value, id } = action;
        old[id] = value;
        return { ...old };
      }
      default:
        return old;
    }
  };
  const [photos, setPhotos] = useReducer(photoReducer, {});

  useEffect(() => {
    fetchPhoto();
  }, []);

  const onChangePhoto = useCallback(
    (id, elem) => {
      if (elem.target.files[0].size > 15288000) {
        showNotification("error", languageState.texts.errors.fileToBig);

        elem.target.value = "";
      } else {
        if (!elem.target.files || !elem.target.files[0]) return;

        const FR = new FileReader();

        FR.addEventListener("load", function (evt) {
          setPhotos({ type: "set", id, value: { blob: evt.target?.result } });
          localSave(evt.target?.result);
        });

        FR.readAsDataURL(elem.target.files[0]);
      }
    },
    [languageState, showNotification, localSave]
  );

  return (
    <section className="relative half-behavior">
      {loading ? (
        <Loading className="w-[250px] h-[250px] absolute top-0 left-0 dark:bg-dark-background bg-light-background z-20" />
      ) : null}
      <PhotoUpload
        className={`${styles.photo} shadow-[black] ${css({
          "*": { borderRadius: "1rem !important" },
        })}`}
        imgClassName="rounded-2xl"
        id="photo"
        value={photos.photo}
        onChange={onChangePhoto}
      />
    </section>
  );
}

Photo.propTypes = {
  model: PropTypes.string,
};

export default Photo;
