import { useMemo, useCallback, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

// contexts
import { useUser } from "../../../contexts/UserProvider";
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useNotification } from "../../../contexts/NotificationProvider";

// services
import { fetchList, fetchListGET } from "../../../services/get";

// components
import Table from "../../../components/Table/Table";
import Loading from "../../../components/Loading/Loading";

// utils
import { deleteModel } from "../../../services/post";
import { getUserName } from "../../../utils/auth";

function List() {
  const { userState } = useUser();
  const { collection } = useParams();
  const { languageState } = useLanguage();

  const { errors } = useMemo(() => {
    return {
      errors: languageState.texts.errors,
    };
  }, [languageState]);

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

  const [loading, setLoading] = useState(true);

  const listReducer = (old, action) => {
    const { type } = action;
    switch (type) {
      case "remove": {
        const { id } = action;
        const newList = [...old];
        const found = newList.findIndex((item) => item.id === id);
        newList.splice(found, 1);
        return newList;
      }
      case "reset":
        return [];
      case "add": {
        const { newList } = action;
        return [...old, ...newList];
      }
      default:
        return old;
    }
  };

  const [list, setList] = useReducer(listReducer, []);
  const [page, setPage] = useState(0);

  const parseQueries = (query, additional) => {
    const parsedQuery = [];
    if (query) {
      if (query.length && typeof query === "object") {
        for (const item of query) {
          if (item.value === "self()") item.value = getUserName();
          parsedQuery.push(item);
        }
      } else {
        if (query?.value === "self()") query.value = getUserName();
        parsedQuery.push(query);
      }
    }
    if (additional) parsedQuery.push(additional);
    return parsedQuery;
  };

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const parsedQuery = parseQueries(
        languageState.texts[collection].query,
        languageState.texts[collection].additionalQueries
      );
      let response;
      if (collection !== "events" && collection !== "projects")
        response = await fetchList(
          collection,
          page,
          [
            "id",
            ...languageState.texts[collection].headers.map((att) => att.id),
          ],
          parsedQuery
        );
      else {
        response = await fetchListGET(
          page,
          languageState.texts.serverNames[collection]
        );
      }
      const { data } = response;
      const remoteList = data.list;
      setList({ type: "add", newList: remoteList });
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", errors.notConnected);
      else showNotification("error", String(err));
    }
    setLoading(false);
  }, [languageState, collection, page, errors, showNotification]);

  useEffect(() => {
    if (!page) setList({ type: "reset" });
    fetch();
  }, [page]);

  const onDelete = useCallback(
    async (id) => {
      try {
        if (collection !== "events" && collection !== "projects")
          await deleteModel(collection, id);
        else await deleteModel("posts", id);
        setList({ type: "remove", id });
      } catch (err) {
        console.error(err);
        if (String(err) === "AxiosError: Network Error")
          showNotification("error", errors.notConnected);
        else showNotification("error", String(err));
      }
    },
    [collection, errors, showNotification]
  );

  return (
    <article className="mt-5">
      {loading ? (
        <Loading />
      ) : (
        <Table
          list={list}
          headers={languageState.texts[collection].headers}
          collection={collection}
          onDelete={onDelete}
          visitable={languageState.texts[collection].visitable}
          notEditable={languageState.texts[collection].notEditable}
        />
      )}
    </article>
  );
}

List.propTypes = {
  collection: PropTypes.string.isRequired,
};

List.defaultProps = {
  collection: "",
};

export default List;
