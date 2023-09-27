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

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useNotification } from "../../../contexts/NotificationProvider";

// images
import noProduct from "../../../assets/images/no-product.jpg";

// components
import Loading from "../../../components/Loading/Loading";
import LazyImage from "../../../components/LazyImage/LazyImage";
import SelectInput from "../../../components/SelectInput/SelectInput";
import SimpleInput from "../../../components/SimpleInput/SimpleInput";
import PasswordInput from "./PasswordInput/PasswordInput";

// services
import { fetchList } from "../../../services/get";
import { saveModel } from "../../../services/post";

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

  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

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

  const [remotes, setRemotes] = useReducer((oldState, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { id, list } = action;
        oldState[id] = list;
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

  const onInputChange = (e) => {
    const { id, value } = e.target;
    setInputValue({ type: "set", id, value });
  };

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

  const onUploadFile = useCallback(
    (e) => {
      const { files, id } = e.target;
      if (files[0].size < 1e7) {
        const file = files[0];
        setFile(file);
        setFileName(files[0].type);
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
    [errors, showNotification, inputValue]
  );

  const [loading, setLoading] = useState(true);

  const onSubmit = useCallback(
    async (e) => {
      setHelperTexts({ type: "clear" });
      e.preventDefault();

      // validating require values
      let requiredError = false;
      Object.values(languageState.texts[collection].inputs).forEach((input) => {
        if (!inputValue[input.id] || !inputValue[input.id].length) {
          console.log(id, input.required, input.requiredOnEdit);
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
          if (!languageState.texts[collection].inputs[key])
            delete toSaveData[key];
          if (languageState.texts[collection].inputs[key].encrypted)
            toSaveData[key] = md5(toSaveData[key]);
          if (languageState.texts[collection].inputs[key].type === "number")
            toSaveData[key] = Number(toSaveData[key]);
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
    },
    [id, errors, messages, showNotification, inputValue]
  );

  const remoteFetch = useCallback(
    async (input) => {
      try {
        const response = await fetchList(input.collection, 0, ["id", "name"]);
        const data = await response.data;
        setRemotes({ type: "set", id: input.id, list: data.list });
        if (input.required)
          setInputValue({ type: "set", id: input.id, value: data.list[0].id });
      } catch (err) {
        console.error(err);
        if (String(err) === "AxiosError: Network Error")
          showNotification("error", errors.notConnected);
        else showNotification("error", errors.couldNotLoadUserTypes);
      }
    },
    [inputValue]
  );

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      if (id && id !== "insert") {
        const response = await fetchList(collection, 0, [], {
          attribute: "id",
          operator: "=",
          value: id,
        });

        const { list } = await response.data;
        const [data] = list;
        setInputValue({ type: init, data });
      }
      for (const input of Object.values(
        languageState.texts[collection].inputs
      )) {
        if (input.remote) await remoteFetch(input);
        switch (input.type) {
          case "number":
            setInputValue({ type: "set", id: input.id, value: 0 });
            break;
          case "password":
          case "text":
          case "email":
            setInputValue({ type: "set", id: input.id, value: "" });
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
  }, [id, errors, showNotification, languageState]);

  useEffect(() => {
    fetch();
  }, [id, collection]);

  const getPhoto = useCallback(
    (id) => {
      if (!inputValue[id]?.length) return noProduct;
      if (inputValue[id]?.length && fileName.length) return inputValue[id];

      return inputValue[id].length && !fileName.length
        ? `${config.apiPhoto}${inputValue[id]}`
        : noProduct;
    },
    [inputValue, fileName]
  );

  const inputsMemo = useMemo(() => {
    if (!loading)
      return Object.values(languageState.texts[collection].inputs).map(
        (input) => (
          <Fragment key={input.id}>
            {input.type === "photo" ? (
              <div className="flex gap-5 items-center justify-start">
                <LazyImage
                  className="h-[150px] w-[150px] my-3 rounded-full"
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
                inputProps={{
                  className: "input primary w-full",
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
