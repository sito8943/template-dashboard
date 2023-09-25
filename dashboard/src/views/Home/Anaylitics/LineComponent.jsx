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
  const [targetSelected, setTargetSelected] = useState([]);

  const toggleEventSelected = (i) => {
    const newTargetSelected = [...targetSelected];
    newTargetSelected[i].active = !newTargetSelected[i].active;
    // @ts-ignore
    setTargetSelected(newTargetSelected);
  };

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(0);
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  const [empty, setEmpty] = useState(true);

  const colors = { red: "#FF0000", green: "#00FF00" };

  const [toFetch, setToFetch] = useState("events");

  const localFetch = useCallback(
    async (options) => {
      setLoading(true);
      try {
        const response = await lineChart(
          options.year || year,
          options.month || month,
          {
            toFetch: toFetch,
            ids: targetSelected
              .filter((target) => target.active)
              .map((target) => target.id),
          }
        );
        const { series, categories } = await response.json();

        setSeries(
          series.map((item) => ({
            ...item,
            color: colors[item.color],
          }))
        );
        if (!series.length || !categories.length) setEmpty(true);
        else setEmpty(false);
        // updating data
        const newTargetSelected = [...targetSelected];
        series.forEach((serial) => {
          const indexOf = newTargetSelected.findIndex(
            (target) => target.id === serial.id
          );
          if (indexOf > -1) newTargetSelected[indexOf].data = serial.data;
        });
        // @ts-ignore
        setTargetSelected(newTargetSelected);
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
    [toFetch, year, month, languageState, targetSelected]
  );

  const localFetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetchEvents();
      const { list } = await response.json();
      setTargetSelected(list.map((item) => ({ ...item, active: true })));
      setEventList(list);
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", languageState.texts.errors.notConnected);
      else showNotification("error", String(err));
    }
    setLoading(false);
  };

  useEffect(() => {
    localFetchEvents();
  }, []);

  useEffect(() => {
    if (targetSelected.length) localFetch({});
  }, [toFetch, eventList, year, month]);

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
    return targetSelected.map((event, i) => (
      <li key={event.name}>
        <button
          onClick={() => toggleEventSelected(i)}
          name={`toggle-${event.name}`}
          type="button"
          className={`${
            event.active
              ? "bg-primary border-primary"
              : "border-placeholder-dark hover:bg-primary hover:border-primary"
          } !py-0 transition border-2 rounded-3xl button !pointer-default`}
        >
          <p className="inline-flex items-center leading-none font-normal">
            {event.name}{" "}
            <span className="text-sm ml-1">
              ({event.data ? sumOfArray(event.data) : null})
            </span>
            <span className={`${event.color} ml-1 -mt-[5px] text-4xl`}>•</span>
          </p>
        </button>
      </li>
    ));
  }, [targetSelected]);

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
            <LineChart series={series} categories={categories} />
          ) : (
            <Empty />
          )}
        </Fragment>
      )}
      <ul className="flex flex-wrap gap-2">{printEvents}</ul>
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
