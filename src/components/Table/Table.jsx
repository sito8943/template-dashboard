import { memo, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faEye } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

// images
import noPhoto from "../../assets/images/no-photo.webp";

// components
import LazyImage from "../LazyImage/LazyImage";

// config
import config from "../../config";

// utils
import { parseDate, toSlug } from "../../utils/parser";

function Table({
  collection,
  list,
  headers,
  onDelete,
  visitable,
  notEditable,
}) {
  const { languageState } = useLanguage();

  const { errors } = useMemo(() => {
    return { errors: languageState.texts.errors };
  }, [languageState]);

  const printHeaders = useCallback(() => {
    return headers.map((header) => <th key={header.id}>{header.label}</th>);
  }, [headers]);

  const printRows = useCallback(() => {
    return list.map((row, i) => (
      <tr key={i}>
        {headers.map((key) => {
          if (key.id === "photo" || key.id === "banner") {
            if (!row[key.id] || !row[key.id].length)
              return (
                <td key={key.id}>
                  <LazyImage
                    className="w-10 h-10 rounded-full object-cover"
                    src={noPhoto}
                    alt="no photo"
                  />
                </td>
              );
            return (
              <td key={key.id}>
                <LazyImage
                  className="w-10 h-10 rounded-full object-cover"
                  src={`${config.apiPhoto}${row[key.id]}`}
                  alt={row.id}
                />
              </td>
            );
          }
          if (key.id === "date")
            return <td key={key.id}>{parseDate(row[key.id])}</td>;
          else return <td key={key.id}>{row[key.id]}</td>;
        })}
        <td>
          <div className="flex gap-2">
            {!notEditable ? (
              <Link to={`/${collection}/insert?id=${row.id}`}>
                <FontAwesomeIcon icon={faPencil} />
              </Link>
            ) : null}
            {visitable ? (
              <a
                target="_blank"
                rel="noreferrer"
                className="icon-button !text-white"
                href={`${config.webUrl}/${collection}/${toSlug(
                  row.title || row.name
                )}`}
              >
                <FontAwesomeIcon icon={faEye} />
              </a>
            ) : null}
            <button
              onClick={() => onDelete(row.id)}
              className="icon-button !text-white"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </td>
      </tr>
    ));
  }, [list, headers, onDelete, collection, visitable, notEditable]);

  return !list.length ? (
    <p>{errors.noResults}</p>
  ) : (
    <table className="w-full">
      <thead>
        <tr>{printHeaders()}</tr>
      </thead>
      <tbody>{printRows()}</tbody>
    </table>
  );
}

Table.propTypes = {
  list: PropTypes.array,
  headers: PropTypes.array,
  onDelete: PropTypes.func,
  collection: PropTypes.string,
};

const TableMemo = memo((props) => <Table {...props} />, arePropsEqual);
TableMemo.displayName = "Table";

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.list === newProps.list &&
    oldProps.headers === newProps.headers &&
    oldProps.collection === newProps.collection &&
    oldProps.onDelete === newProps.onDelete
  );
}

export default Table;
