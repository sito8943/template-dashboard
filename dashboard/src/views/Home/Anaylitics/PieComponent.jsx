import React, { useEffect, useCallback, useState, Fragment } from "react";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useNotification } from "../../../contexts/NotificationProvider";

// components
import Empty from "../../../components/Error/Empty";
import Loading from "../../../components/Loading/Loading";
import PieChart from "../../../components/Charts/PieChart";

// services
import { pieChart, fetchData } from "../../../services/analytics";

// styles
import "./chart.css";

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

  const [event, setEvent] = useState("");
  const [attribute, setAttribute] = useState("country");
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(0);

  const [count, setCounts] = useState([]);
  const [colors, setColors] = useState([]);
  const [labels, setLabels] = useState([]);
  const [empty, setEmpty] = useState(false);

  const [eventList, setEventList] = useState([]);

  const localFetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetchData();
      const { list } = await response.json();
      setEventList(list);
      localFetch({});
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", languageState.texts.errors.notConnected);
      else showNotification("error", String(err));
    }
  };

  useEffect(() => {
    localFetchEvents();
  }, []);

  const localFetch = useCallback(
    async (options) => {
      setLoading(true);
      setEmpty(false);
      try {
        const response = await pieChart(
          options.year || year,
          options.month || month,
          options.attribute || attribute,
          options.event || event
        );
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
    },
    [year, month, attribute]
  );

  return (
    <div className="chart">
      <div className="flex items-center mb-1 justify-between w-full">
        <div className="flex flex-wrap gap-2 pr-10">
          <select
            value={attribute}
            className="input primary !py-0 h-[30px]"
            onChange={(e) => {
              setAttribute(e.target.value);
              localFetch({ attribute: e.target.value });
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
          <select
            value={event}
            className="input primary !py-0 h-[30px]"
            onChange={(e) => {
              setEvent(e.target.value);
              localFetch({ event: e.target.value });
            }}
          >
            <option value={""}>
              {languageState.texts.analytics.allEvents}
            </option>
            {eventList.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => {
              setMonth(Number(e.target.value));
              localFetch({ month: Number(e.target.value) });
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
              localFetch({ year: Number(e.target.value) });
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
          ) : (
            <Empty />
          )}
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
