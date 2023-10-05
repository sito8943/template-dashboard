import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useReducer,
  Fragment,
} from "react";
import { useParams } from "react-router-dom";
import md5 from "md5";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useNotification } from "../../../contexts/NotificationProvider";

// images
import noProduct from "../../../assets/images/no-product.jpg";

// components
import PasswordInput from "./PasswordInput/PasswordInput";
import Loading from "../../../components/Loading/Loading";
import LazyImage from "../../../components/LazyImage/LazyImage";
import SelectInput from "../../../components/SelectInput/SelectInput";
import SimpleInput from "../../../components/SimpleInput/SimpleInput";

// services
import { fetchList } from "../../../services/get";
import { saveModel } from "../../../services/post";

// utils
import { parseIcon } from "../utils";
import { toSlug } from "../../../utils/parser";

// config
import config from "../../../config";

function Form() {
  const { id, collection } = useParams();

  const { languageState } = useLanguage();

  const { labels, buttons, errors, messages } = useMemo(
    () => ({
      labels: languageState.texts.labels,
      errors: languageState.texts.errors,
      messages: languageState.texts.messages,
      buttons: languageState.texts.buttons,
    }),
    [languageState]
  );

  const [tFiles, setFiles] = useState({});
  const [fileNames, setFileNames] = useState({});

  const [helperTexts, setHelperTexts] = useReducer((oldState, action) => {
    const { type } = action;
    switch (type) {
      case "clear":
        return {};
      case "set": {
        const { id, value } = action;
        oldState[id] = value;
        return { ...oldState };
      }
      default:
        return oldState;
    }
  }, {});

  const [inputValue, setInputValue] = useReducer((oldState, action) => {
    const { type } = action;
    switch (type) {
      case "init": {
        const { data } = action;
        return data;
      }
      case "set": {
        const { id, value } = action;
        oldState[id] = value;
        return { ...oldState };
      }
      default:
        return oldState;
    }
  }, {});

  const onInputChange = useCallback(
    (e) => {
      const { id, value } = e.target;
      const transformation =
        languageState.texts[collection].inputs[id].transformation;
      let parsedValue = value;
      if (transformation)
        switch (transformation) {
          default: // slug case
            parsedValue = toSlug(value);
            break;
        }
      setInputValue({ type: "set", id, value: parsedValue });
    },
    [collection]
  );

  const [remotes, setRemotes] = useReducer((oldState, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { id, list, toSet, required } = action;
        oldState[id] = list;
        if (required)
          setInputValue({
            type: "set",
            id,
            value: toSet,
          });

        return { ...oldState };
      }
      default:
        return oldState;
    }
  }, {});

  const onRemoteSelect = (e) => {
    const { id, value } = e.target;
    setInputValue({ type: "set", id, value });
  };

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const onUploadFile = useCallback(
    (e) => {
      const { files, id } = e.target;
      if (files[0].size < 1e7) {
        const file = files[0];
        tFiles[id] = file;

        setFiles({ ...tFiles });
        fileNames[id] = files[0].type;
        setFileNames({ ...fileNames });
        const newReader = new FileReader();
        newReader.onload = async (e) => {
          const content = e.target.result;
          setInputValue({ type: "set", id, value: content });
        };
        newReader.readAsDataURL(files[0]);
      } else {
        showNotification("error", errors.fileToBig);
      }
    },
    [errors, showNotification, inputValue, tFiles, fileNames]
  );

  const [loading, setLoading] = useState(true);

  const onSubmit = async (e) => {
    setHelperTexts({ type: "clear" });
    e.preventDefault();

    // validating require values
    let requiredError = false;
    Object.values(languageState.texts[collection].inputs).forEach((input) => {
      if (!inputValue[input.id] || !inputValue[input.id].length) {
        if (
          (input.requiredOnEdit && id && id !== "insert") ||
          (input.required && (!id || id === "insert"))
        ) {
          setHelperTexts({
            type: "set",
            id: input.id,
            value: errors[`${input.id}Required`],
          });
          requiredError = true;
        }
      }
    });
    if (requiredError) return;
    setLoading(true);
    try {
      // parse data
      const toSaveData = { ...inputValue };
      Object.keys(toSaveData).forEach((key) => {
        if (toSaveData[key] && toSaveData[key].length) {
          if (!languageState.texts[collection].inputs[key])
            delete toSaveData[key];
          if (languageState.texts[collection].inputs[key].encrypted)
            toSaveData[key] = md5(toSaveData[key]);
          if (languageState.texts[collection].inputs[key].type === "number")
            toSaveData[key] = Number(toSaveData[key]);
        }
        if (id && (!toSaveData[key] || !toSaveData[key].length)) {
          delete toSaveData[key];
        }
      });
      const result = await saveModel(collection, {
        id: !id || id === "insert" ? undefined : id,
        ...toSaveData,
      });
      const data = await result.data;
      switch (data.message) {
        case "passwords are not equal":
          showNotification("error", errors.passwordsAreNotEqual);
          break;
        case "name taken":
          showNotification(
            "error",
            errors.nameTaken.replace(
              "[model]",
              languageState.texts[collection].name
            )
          );
          break;
        default:
          if (!id) setInputValue({ type: "set", data: {} });
          showNotification("success", messages.saved);
          break;
      }
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", errors.notConnected);
      else showNotification("error", String(err));
    }
    setLoading(false);
  };

  const remoteFetch = async (input, already = undefined) => {
    try {
      const response = await fetchList(input.collection, 0, ["id", "name"]);
      const data = await response.json();

      setRemotes({
        type: "set",
        id: input.id,
        list: data.list,
        toSet: already || data.list[0].id,
        required: input.required,
      });
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", errors.notConnected);
      else showNotification("error", errors.couldNotLoadUserTypes);
    }
  };

  const fetch = async () => {
    setLoading(true);
    try {
      let data = undefined;
      if (id && id !== "insert") {
        const response = await fetchList(collection, 0, [], {
          attribute: "id",
          operator: "=",
          value: id,
        });

        const { list } = await response.json();
        data = list[0];
      }
      for (const input of Object.values(
        languageState.texts[collection].inputs
      )) {
        if (input.remote) {
          await remoteFetch(input, data ? data[input.id] : undefined);
        }
        switch (input.type) {
          case "photo":
            if (data && data[input.id])
              setInputValue({
                type: "set",
                id: input.id,
                value: data[input.id],
              });
            break;
          case "number":
            setInputValue({
              type: "set",
              id: input.id,
              value: data && data[input.id] ? data[input.id] : 0,
            });
            break;
          case "password":
          case "text":
          case "email":
            setInputValue({
              type: "set",
              id: input.id,
              value: data && data[input.id] ? data[input.id] : "",
            });
            break;
        }
      }
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", errors.notConnected);
      else showNotification("error", String(err));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [id, collection]);

  const getPhoto = useCallback(
    (id) => {
      if (!inputValue[id]?.length) return noProduct;
      if (inputValue[id]?.length && fileNames[id] && fileNames[id].length)
        return inputValue[id];

      return inputValue[id].length && (!fileNames[id] || !fileNames[id].length)
        ? `${config.apiPhoto}${inputValue[id]}`
        : noProduct;
    },
    [inputValue, fileNames]
  );

  const inputsMemo = useMemo(() => {
    if (!loading)
      return Object.values(languageState.texts[collection].inputs).map(
        (input) => (
          <Fragment key={input.id}>
            {input.type === "photo" ? (
              <div className="flex gap-5 items-center justify-start">
                <LazyImage
                  className="h-[150px] w-[150px] my-3 rounded-full object-cover"
                  src={getPhoto(input.id)}
                  alt={`${collection} image`}
                />
                <label className="primary submit rounded-3xl w-[180px] h-[45px] flex items-center justify-center text-center relative">
                  {buttons.uploadPhoto}
                  <input
                    id={input.id}
                    type="file"
                    accept="image/*"
                    className="absolute"
                    onChange={onUploadFile}
                  />
                </label>
              </div>
            ) : null}
            {input.type === "text" ||
            input.type === "email" ||
            input.type === "number" ? (
              <SimpleInput
                id={input.id}
                className="input-control"
                label={labels[input.id]}
                leftIcon={
                  input.icon ? (
                    <FontAwesomeIcon
                      className="absolute text-white top-[50%] -translate-y-[50%] left-3"
                      icon={parseIcon(input.icon, inputValue[input.id])}
                    />
                  ) : null
                }
                inputProps={{
                  className: `input primary ${
                    input.icon ? "!pl-8" : ""
                  } w-full`,
                  value: inputValue[input.id],
                  onChange: onInputChange,
                  type: "text",
                  disabled: input.requiredOnEdit && id && id !== "insert",
                }}
                helperText={helperTexts[input.id]}
              />
            ) : null}
            {input.type === "password" ? (
              <PasswordInput
                id={input.id}
                label={labels[input.id]}
                helperText={helperTexts[input.id]}
                value={inputValue[input.id]}
                onChange={onInputChange}
              />
            ) : null}
            {input.type === "select" && input.remote ? (
              <SelectInput
                id={input.id}
                className="input-control"
                label={labels[input.id]}
                inputProps={{
                  onChange: onRemoteSelect,
                  value: inputValue[input.id],
                  className: "input primary !pr-5 w-full",
                }}
                options={remotes[input.id]}
              />
            ) : null}
          </Fragment>
        )
      );
  }, [
    loading,
    collection,
    languageState,
    inputValue,
    remotes,
    helperTexts,
    labels,
  ]);

  return (
    <section className="relative">
      {loading ? (
        <Loading className="w-full h-full absolute top-0 left-0 dark:bg-dark-background bg-light-background z-20" />
      ) : null}
      <form onSubmit={onSubmit} className="w-[80%] mt-5 flex flex-col gap-5">
        {!loading ? inputsMemo : null}
        <div className="mt-3">
          <button
            name="save"
            type="submit"
            className="primary button submit"
            aria-label={languageState.texts.ariaLabels.save}
          >
            {buttons.save}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Form;
