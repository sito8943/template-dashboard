import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import md5 from "md5";

import { parseQueries } from "some-javascript-utils/browser";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLockOpen, faLock } from "@fortawesome/free-solid-svg-icons";

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

// services
import { fetchList } from "../../../services/get";
import { saveModel } from "../../../services/post";

// utils
import { toSlug } from "../../../utils/parser";

// config
import config from "../../../config";

function Form() {
  const location = useLocation();

  const [id, setId] = useState("");

  const { languageState } = useLanguage();

  const { inputs, users, auth, buttons, errors, messages } = useMemo(
    () => ({
      auth: languageState.texts.auth,
      errors: languageState.texts.errors,
      messages: languageState.texts.messages,
      buttons: languageState.texts.buttons,
      users: languageState.texts.users,
      inputs: languageState.texts.inputs,
    }),
    [languageState]
  );

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState("");

  const handlePassword = useCallback((e) => setPassword(e.target.value), []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const [rPassword, setRPassword] = useState("");
  const [showRPassword, setShowRPassword] = useState(false);
  const [rPasswordHelperText, setRPasswordHelperText] = useState("");

  const handleRPassword = useCallback((e) => setRPassword(e.target.value), []);

  const toggleShowRPassword = useCallback(() => {
    setShowRPassword(!showRPassword);
  }, [showRPassword]);

  const [name, setName] = useState("");
  const [nameHelperText, setNameHelperText] = useState("");

  const handleName = useCallback((e) => {
    setName(e.target.value);
  }, []);

  const [user, setUser] = useState("");
  const [userHelperText, setUserHelperText] = useState("");

  const handleUser = useCallback((e) => {
    setUser(toSlug(e.target.value));
  }, []);

  const [email, setEmail] = useState("");
  const [emailHelperText, setEmailHelperText] = useState("");

  const handleEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const [photo, setPhoto] = useState("");
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

  const [userType, setUserType] = useState("");
  const [userTypes, setUserTypes] = useState([]);

  const onUserTypesSelect = useCallback(
    (e) => {
      setUserType(userTypes[e.target.value].id);
    },
    [userTypes]
  );

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
      const { files } = e.target;
      if (files[0].size < 1e7) {
        const file = files[0];
        setFile(file);
        setFileName(files[0].type);
        const newReader = new FileReader();
        newReader.onload = async (e) => {
          const content = e.target.result;
          setPhoto(content);
        };
        newReader.readAsDataURL(files[0]);
      } else {
        showNotification("error", errors.fileToBig);
      }
    },
    [errors, showNotification]
  );

  const [loading, setLoading] = useState(true);

  const saveUser = useCallback(
    async (e) => {
      setNameHelperText("");
      e.preventDefault();
      setLoading(true);
      if (!user.length) {
        document.getElementById("user")?.focus();
        setUserHelperText(errors.user3rdRequired);
        setLoading(false);
        return;
      }
      if (!name.length) {
        document.getElementById("name")?.focus();
        setNameHelperText(errors.nameRequired);
        setLoading(false);
        return;
      }
      if (!email.length) {
        document.getElementById("email")?.focus();
        setEmailHelperText(errors.email3rdRequired);
        setLoading(false);
        return;
      }
      if (!password.length && !id.length) {
        document.getElementById("password")?.focus();
        setPasswordHelperText(errors.passwordRequired);
        setLoading(false);
        return;
      }
      if (password !== rPassword && !id.length) {
        document.getElementById("rPassword")?.focus();
        setRPasswordHelperText(errors.passwordsNotEqual);
        setLoading(false);
        return;
      }
      try {
        const result = await saveModel("users", {
          id: id.length ? id : undefined,
          user,
          email,
          name,
          pw: !id.length ? md5(password) : undefined,
          photo,
          type: userType,
        });
        const data = await result.data;
        switch (data.message) {
          case "name taken":
            showNotification(
              "error",
              errors.nameTaken.replace(
                "[model]",
                languageState.texts.users.name
              )
            );
            break;
          default:
            setId("");
            setUser("");
            setName("");
            setEmail("");
            setPassword("");
            setRPassword("");
            setPhoto("");
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
    [
      id,
      errors,
      messages,
      showNotification,
      name,
      user,
      email,
      password,
      rPassword,
      photo,
      userType,
    ]
  );

  const fetchUserTypes = useCallback(async () => {
    try {
      const response = await fetchList("userTypes", 0, ["id", "name"]);
      const data = await response.data;
      setUserTypes(data.list);
      if (userType === "") setUserType(data.list[0].id);
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", errors.notConnected);
      else showNotification("error", errors.couldNotLoadUserTypes);
    }
  }, [userType]);

  const fetch = useCallback(
    async (id) => {
      try {
        const response = await fetchList("users", 0, [], {
          attribute: "id",
          operator: "=",
          value: id,
        });

        const { list } = await response.data;
        const [data] = list;
        setUser(data.user);
        setName(data.name);
        setEmail(data.email);
        setPhoto(data.photo);
        setUserType(data.type);
      } catch (err) {
        console.error(err);
        if (String(err) === "AxiosError: Network Error")
          showNotification("error", errors.notConnected);
        else showNotification("error", String(err));
      }
      setLoading(false);
    },
    [errors, showNotification]
  );

  useEffect(() => {
    fetchUserTypes();
    const { search } = location;
    const params = parseQueries(search);
    if (params.id) {
      setId(params.id);
      fetch(params.id);
    } else setLoading(false);
  }, [location]);

  const getPhoto = useCallback(() => {
    if (!photo.length) return noProduct;
    if (photo.length && fileName.length) return photo;

    return photo.length && !fileName.length
      ? `${config.apiPhoto}${photo}`
      : noProduct;
  }, [photo, fileName]);

  return (
    <article className="relative">
      {loading ? (
        <Loading className="w-full h-full absolute top-0 left-0 dark:bg-dark-background bg-light-background z-20" />
      ) : null}
      <form onSubmit={saveUser} className="w-[80%] mt-5">
        <div className="flex gap-5 items-center justify-start">
          <label htmlFor="photo">{users.labels.photo}</label>
          <label className="primary button w-[150px] h-[45px] text-center">
            {buttons.uploadPhoto}
            <input onChange={onUploadFile} type="file" accept="image/*" />
          </label>
        </div>
        <LazyImage
          className="h-[150px] w-[150px] my-3 rounded-full"
          src={getPhoto()}
          alt="product image"
        />
        <SimpleInput
          id="user"
          className="input-control"
          label={auth.labels.user}
          inputProps={{
            className: "input primary w-full",
            value: user,
            onChange: handleUser,
            type: "text",
            disabled: id.length,
          }}
          helperText={userHelperText}
        />
        <SimpleInput
          id="name"
          className="input-control"
          label={users.labels.name}
          inputProps={{
            className: "input primary w-full",
            value: name,
            onChange: handleName,
            type: "text",
          }}
          helperText={nameHelperText}
        />
        <SimpleInput
          id="email"
          className="input-control"
          label={users.labels.email}
          inputProps={{
            className: "input primary w-full",
            value: email,
            onChange: handleEmail,
            type: "text",
          }}
          helperText={emailHelperText}
        />
        <SelectInput
          id="type"
          className="input-control"
          label={inputs.userType}
          inputProps={{
            onChange: onUserTypesSelect,
            className: "input primary !pr-5 w-full",
          }}
          options={userTypes}
        />
        <SimpleInput
          id="password"
          className="input-control"
          label={auth.labels.password}
          inputProps={{
            className: "input primary !pl-8 w-full",
            value: password,
            onChange: handlePassword,
            type: !showPassword ? "password" : "string",
          }}
          leftIcon={
            <button tabIndex={-1} type="button" onClick={toggleShowPassword}>
              <FontAwesomeIcon
                name="toggle-see-password"
                icon={showPassword ? faLockOpen : faLock}
                aria-label={languageState.texts.ariaLabels.toggleShowPassword}
                className="absolute text-white top-[50%] -translate-y-[50%] left-3"
              />
            </button>
          }
          helperText={passwordHelperText}
        />
        <SimpleInput
          id="rPassword"
          className="input-control"
          label={auth.labels.rPassword}
          inputProps={{
            className: "input primary !pl-8 w-full",
            value: rPassword,
            onChange: handleRPassword,
            type: !showRPassword ? "password" : "string",
          }}
          leftIcon={
            <button tabIndex={-1} type="button" onClick={toggleShowRPassword}>
              <FontAwesomeIcon
                name="toggle-see-password"
                icon={showRPassword ? faLockOpen : faLock}
                aria-label={languageState.texts.ariaLabels.toggleShowPassword}
                className="absolute text-white top-[50%] -translate-y-[50%] left-3"
              />
            </button>
          }
          helperText={rPasswordHelperText}
        />

        <div className="mt-3">
          <button
            name="save"
            aria-label={languageState.texts.ariaLabels.save}
            type="submit"
            className="primary button"
          >
            {buttons.save}
          </button>
        </div>
      </form>
    </article>
  );
}

export default Form;
