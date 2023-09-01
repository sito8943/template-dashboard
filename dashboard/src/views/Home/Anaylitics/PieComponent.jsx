import React, { useEffect, useCallback, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useNotification } from "../../../contexts/NotificationProvider";

// components
import Loading from "../../../components/Loading/Loading";
import PieChart from "../../../components/Charts/PieChart";

// services
import { fetchAttribute } from "../../../services/analytics";

function PieComponent() {
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

  const [attribute, setAttribute] = useState("country");
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(0);

  const [count, setCounts] = useState([]);
  const [colors, setColors] = useState([]);
  const [labels, setLabels] = useState([]);
  const [empty, setEmpty] = useState(false);

  const localFetch = useCallback(async () => {
    setLoading(true);
    setEmpty(false);
    try {
      const response = await fetchAttribute(year, month, attribute);
      const data = await response.json();
      const { colors, labels, series } = data;
      if (!colors.length || !labels.length || !series.length) setEmpty(true);
      setCounts(series);
      setColors(colors);
      setLabels(labels);
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", errors.notConnected);
      else showNotification("error", String(err));
    }
    setLoading(false);
  }, [year, month, attribute]);

  useEffect(() => {
    localFetch();
  }, []);

  return (
    <div className="w-full bg-light-background2 rounded-lg shadow dark:bg-dark-background2 p-4">
      <div className="flex items-center mb-1 justify-between w-full">
        <h3 className="text-xl font-bold leading-none">
          <select
            value={attribute}
            className="input primary !py-0 h-[30px]"
            onChange={(e) => {
              setAttribute(e.target.value);
              localFetch();
            }}
          >
            {Object.keys(languageState.texts.analytics.attributes).map(
              (key) => (
                <option key={key} value={key}>
                  {languageState.texts.analytics.attributes[key]}
                </option>
              )
            )}
          </select>
        </h3>
        <div className="p-3 flex gap-3" aria-labelledby="dateRangeButton">
          <select
            value={month}
            onChange={(e) => {
              setMonth(Number(e.target.value));
              localFetch();
            }}
            className="input primary !py-0 h-[30px]"
          >
            <option value={0}>{languageState.texts.inputs.month}</option>
            {languageState.texts.analytics.months.map((month, i) => (
              <option key={i} value={i + 1}>
                {month}
              </option>
            ))}
          </select>
          <input
            id="year"
            name="year"
            type="number"
            value={year}
            onChange={(e) => {
              setYear(Number(e.target.value));
              localFetch();
            }}
            className="input primary !py-0 h-[30px] w-[120px]"
            placeholder={languageState.texts.inputs.year}
          />
        </div>
      </div>
      {loading ? (
        <Loading className="absolute top-0 left-0 w-full h-full bg-light-background dark:bg-dark-background" />
      ) : (
        <Fragment>
          {!empty ? (
            <PieChart labels={labels} colors={colors} series={count} />
          ) : <Empty text="metrics" />}
        </Fragment>
      )}

      {/* <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mt-2.5">
        <div className="pt-5">
          <Link to="/" className="button primary">
            <FontAwesomeIcon icon={faFile} className="mr-2" />
            {languageState.texts.analytics.actions.fullReport}
          </Link>
        </div>
      </div> */}
    </div>
  );
}

export default PieComponent;
