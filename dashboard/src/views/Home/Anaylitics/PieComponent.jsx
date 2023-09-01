import React, { useEffect, useCallback, useState } from "react";
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

function PieComponent({ attribute }) {
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

  const [loading, setLoading] = useState(true);

  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);

  const [count, setCounts] = useState([]);
  const [colors, setColors] = useState([]);
  const [labels, setLabels] = useState([]);

  const localFetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAttribute(year, month, attribute);
      const data = await response.json();
      const { colors, labels, series } = data;
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
  }, [year, month]);

  useEffect(() => {
    localFetch();
  }, []);

  return (
    <div className="w-full bg-light-background2 rounded-lg shadow dark:bg-dark-background2 p-4">
      <div className="flex justify-between items-start w-full">
        <div className="flex-col items-center">
          <div className="flex items-center mb-1">
            <h3 className="text-xl font-bold leading-none">
              {languageState.texts.analytics.attributes[attribute]}
            </h3>
          </div>

          <div className="z-10 rounded-lg shadow w-80 lg:w-96">
            <div className="p-3" aria-labelledby="dateRangeButton">
              <div className="flex items-center">
                <div className="relative">
                  <input
                    name="start"
                    type="number"
                    className="input primary"
                    placeholder={languageState.texts.inputs.startDate}
                  />
                </div>
                <p className="mx-2">{languageState.texts.analytics.to}</p>
                <div className="relative">
                  <input
                    name="end"
                    type="number"
                    className="input primary"
                    placeholder={languageState.texts.inputs.endDate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading className="absolute top-0 left-0 w-full h-full" />
      ) : (
        <PieChart labels={labels} colors={colors} series={count} />
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

PieComponent.defaultProps = {
  attribute: "country",
};

export default PieComponent;
