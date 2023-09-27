import React, {
  useMemo,
  useEffect,
  useCallback,
  useState,
  Fragment,
} from "react";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useNotification } from "../../../contexts/NotificationProvider";

// components
import Empty from "../../../components/Error/Empty";
import Loading from "../../../components/Loading/Loading";
import BarChart from "../../../components/Charts/BarChart";

// services
import { fetchData, barChart } from "../../../services/analytics";

// styles
import "./chart.css";

function BarComponent() {
  const { languageState } = useLanguage();

  const [loading, setLoading] = useState(true);

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

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(0);

  // chart resources
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  const [empty, setEmpty] = useState(true);

  const [attributes, setAttributes] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState();
  const [selectedEvent, setSelectedEvent] = useState();
  const [toFetch, setToFetch] = useState("events");

  const colors = { red: "#FF0000", green: "#00FF00" };

  const fetch = useCallback(
    async (options) => {
      setLoading(true);
      try {
        const ids =
          toFetch === "attributes"
            ? [attributes[selectedAttribute].name]
            : [eventList[selectedEvent].id];
        const response = await barChart(year, month, {
          toFetch,
          ids,
        });
        const { series, categories } = await response.json();
        setSeries(
          series.map((item) => ({
            ...item,
            color: colors[item.color],
          }))
        );
        if (!series.length || !categories.length) setEmpty(true);
        else setEmpty(false);
        if (month) setCategories(categories.map((category) => `${category}`));
        else setCategories(languageState.texts.analytics.reducedMonths);
      } catch (err) {
        console.error(err);
        if (String(err) === "AxiosError: Network Error")
          showNotification("error", languageState.texts.errors.notConnected);
        else showNotification("error", String(err));
      }
      setLoading(false);
    },
    [toFetch, year, month, languageState, selectedAttribute, selectedEvent]
  );

  const fetchAttributes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchData("attributes");
      const { list } = await response.json();
      setAttributes(list);
      setSelectedAttribute(0);
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", languageState.texts.errors.notConnected);
      else showNotification("error", String(err));
    }
    setLoading(false);
  }, [toFetch]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchData(toFetch);
      const { list } = await response.json();
      setEventList(list);
      setSelectedEvent(0);
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", languageState.texts.errors.notConnected);
      else showNotification("error", String(err));
    }
    setLoading(false);
  }, [toFetch]);

  useEffect(() => {
    fetchEvents();
    fetchAttributes();
  }, []);

  useEffect(() => {
    if (selectedAttribute !== undefined || selectedEvent !== undefined) fetch();
  }, [year, month, toFetch, selectedAttribute, selectedEvent]);

  return (
    <div className="chart">
      <div className="flex justify-between mb-5 items-center">
        <div className="p-3 flex gap-3 pl-0" aria-labelledby="dateRangeButton">
          <select
            value={toFetch}
            className="input primary !py-0 h-[30px]"
            onChange={(e) => setToFetch(e.target.value)}
          >
            {Object.keys(languageState.texts.analytics.models).map((model) => (
              <option key={model} value={model}>
                {languageState.texts.analytics.models[model]}
              </option>
            ))}
          </select>
          {toFetch === "attributes" ? (
            <select
              value={selectedAttribute}
              className="input primary !py-0 h-[30px]"
              onChange={(e) => setSelectedAttribute(Number(e.target.value))}
            >
              {attributes.map((attribute) => (
                <option key={attribute} value={attribute}>
                  {languageState.texts.analytics.attributes[attribute.name]}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={selectedEvent}
              className="input primary !py-0 h-[30px]"
              onChange={(e) => setSelectedEvent(Number(e.target.value))}
            >
              {eventList.map((event, i) => (
                <option key={event.id} value={i}>
                  {event.name}
                </option>
              ))}
            </select>
          )}
          <select
            value={month}
            onChange={(e) => {
              setMonth(Number(e.target.value));
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
            <BarChart series={series} categories={categories} />
          ) : (
            <Empty />
          )}
        </Fragment>
      )}
    </div>
  );
}

export default BarComponent;
