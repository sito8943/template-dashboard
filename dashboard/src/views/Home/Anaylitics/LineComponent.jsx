// @ts-check
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
import LineChart from "../../../components/Charts/LineChart";

// services
import { fetchEvents, lineChart } from "../../../services/analytics";

// styles
import "./chart.css";

function LineComponent() {
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

  const [eventList, setEventList] = useState([]);
  const [eventsSelected, setEventsSelected] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(0);
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  const [empty, setEmpty] = useState(false);

  const colors = { red: "#FF0000", green: "#00FF00" };

  const localFetchTriggers = useCallback(
    async (list) => {
      try {
        setEmpty(false);
        const response = await lineChart(year, month, list);
        const { series, categories } = await response.json();
        setSeries(
          series.map((item) => ({ ...item, color: colors[item.color] }))
        );
        if (!series.length || !categories.length) setEmpty(true);
        setEventsSelected(series);
        if (month)
          setCategories(
            categories.map(
              (category) =>
                `${category} ${languageState.texts.analytics.reducedMonths[month]}`
            )
          );
        else setCategories(languageState.texts.analytics.reducedMonths);
      } catch (err) {
        console.error(err);
        if (String(err) === "AxiosError: Network Error")
          showNotification("error", languageState.texts.errors.notConnected);
        else showNotification("error", String(err));
      }
      setLoading(false);
    },
    [year, month, languageState]
  );

  const localFetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetchEvents();
      const { list } = await response.json();
      setEventList(list);
      await localFetchTriggers(list.map((event) => event.id));
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

  /**
   *
   * @param {number[]} array
   */
  function sumOfArray(array) {
    let sum = 0;
    array.forEach((item) => {
      sum += item;
    });
    return sum;
  }

  const printEvents = useMemo(() => {
    return eventsSelected.map((event) => (
      <div key={event.name}>
        <h5 className="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
          {event.name}{" "}
          <span className={`${event.color} ml-1 -mt-[5px] text-4xl`}>•</span>
        </h5>
        <p className="text-gray-900 dark:text-white text-2xl leading-none font-bold">
          {event.data ? sumOfArray(event.data) : null}
        </p>
      </div>
    ));
  }, [eventsSelected]);

  return (
    <div className="chart">
      <div className="flex justify-between mb-5 items-center">
        <div className="grid gap-4 grid-cols-2">{printEvents}</div>

        <div className="p-3 flex gap-3" aria-labelledby="dateRangeButton">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
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
            onChange={(e) => setYear(Number(e.target.value))}
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
            <LineChart series={series} categories={categories} />
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

export default LineComponent;
