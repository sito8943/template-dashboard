import React, {
  useReducer,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Tippy from "@tippyjs/react";

// @emotion/css
import { css } from "@emotion/css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// components
import Switch from "../../../components/Switch/Switch";
import Loading from "../../../components/Loading/Loading";
import PhotoUpload from "../../../components/PhotoUpload/PhotoUpload";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useNotification } from "../../../contexts/NotificationProvider";

// services
import { fetchList } from "../../../services/get";
import { savePage } from "../../../services/pages";

// utils
import { parseIcon } from "../../../layouts/Model/utils";

function ContactUs() {
  const { languageState } = useLanguage();

  const { contactUs } = useMemo(
    () => languageState.texts.pages.home,
    [languageState]
  );

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [loading, setLoading] = useState(true);

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
  const [photo, setPhoto] = useReducer(photoReducer, {});

  const onPhotoChange = (id, event) => {
    if (event.target.files[0].size > 15288000) {
      showNotification("error", languageState.texts.errors.fileToBig);

      event.target.value = "";
    } else {
      if (!event.target.files || !event.target.files[0]) return;

      const FR = new FileReader();

      FR.addEventListener("load", function (evt) {
        setPhoto({ type: "set", id, value: { blob: evt.target?.result } });
      });

      FR.readAsDataURL(event.target.files[0]);
    }
  };

  const [showSocialMedia, setShowSocialMedia] = useState(true);
  const [socialMedia, setSocialMedia] = useState([]);

  useEffect(() => {
    setSocialMedia(
      socialMedia.map((social) => ({ ...social, active: showSocialMedia }))
    );
  }, [showSocialMedia]);

  const fetchSocialMedia = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchList("socialMedia", 0, ["id", "url"]);
      const { list } = await response.json();
      // setSocialMedia(list)
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", errors.notConnected);
      else showNotification("error", String(err));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // load image and socialMedia
    fetchSocialMedia();
  }, []);

  const toggleSocialMedia = useCallback(
    (social) => {
      const newSocial = [...socialMedia];
      newSocial[social].active = !newSocial[social].active;
      setSocialMedia(newSocial);
    },
    [socialMedia]
  );

  const printSocial = useMemo(() => {
    return socialMedia.map((social, i) => (
      <li key={social.id}>
        <button
          type="button"
          className={`icon-button primary ${
            !social.active ? "!text-[gray]" : ""
          }`}
          onClick={() => toggleSocialMedia(i)}
        >
          <FontAwesomeIcon
            className="text-3xl"
            icon={parseIcon("socialMedia", social.url)}
          />
        </button>
      </li>
    ));
  }, [socialMedia, toggleSocialMedia]);

  const onSave = async () => {
    setLoading(true);
    try {
      await savePage("home-contactUs", { socialMedia, photo });
      showNotification("success", languageState.texts.messages.saved);
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", languageState.texts.errors.notConnected);
      else showNotification("error", String(err));
    }
    setLoading(false);
  };

  return (
    <article id="contactUs" className="page-article">
      <h3>
        {contactUs.title}{" "}
        <span>
          <Tippy content={contactUs.description}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </Tippy>
        </span>
      </h3>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex gap-5 flex-col">
          <div className="flex flex-col gap-3">
            <Switch
              id="toggle-social-media"
              value={showSocialMedia}
              onChange={() =>
                setShowSocialMedia((showSocialMedia) => !showSocialMedia)
              }
              label={contactUs.showSocialMedia}
            />
            <div
              className={`grid transition-all duration-300 ${
                showSocialMedia ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <ul className="overflow-hidden flex gap-2 items-center justify-start">
                {printSocial}
                <li>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="/socialMedia/insert"
                    className={`icon-button primary submit !min-w-[30px] !w-[30px] !min-h-[30px] !h-[30px]`}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faAdd} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <PhotoUpload
            id="photo"
            value={photo.photo}
            label={contactUs.photo}
            onChange={onPhotoChange}
            imgClassName="rounded-2xl !h-[250px]"
            className={`w-full gap-4 -mt-1 flex flex-col rounded-full object-cover shadow-[black] ${css(
              {
                "*": { borderRadius: "1rem !important" },
              }
            )}`}
          />
        </div>
      )}
      <div>
        <button onClick={onSave} type="button" className="primary submit">
          {languageState.texts.buttons.save}
        </button>
      </div>
    </article>
  );
}

export default ContactUs;
