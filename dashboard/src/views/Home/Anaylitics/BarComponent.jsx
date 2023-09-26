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

  const [eventList, setEventList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(0);
  const [series, setSeries] = useState([]);
  const [rColors, setColors] = useState([]);

  const [categories, setCategories] = useState([]);
  const [empty, setEmpty] = useState(false);

  const colors = { red: "#FF0000", green: "#00FF00" };

  const [total, setTotal] = useState(0);

  const localFetchTriggers = useCallback(
    async (options) => {
      setLoading(true);
      if (selectedEvent) {
        try {
          setEmpty(false);
          const response = await barChart(
            options.year || year,
            options.month || month,
            [selectedEvent.id]
          );
          const { series, categories } = await response.json();
          const newColors = [];
          let newTotal = 0;
          setSeries(
            series.map((item) => {
              item.data.forEach((num) => {
                newTotal += num;
              });
              newColors.push(colors[item.color]);
              item.color = colors[item.color];
              delete item.id;
              return { ...item };
            })
          );
          setTotal(newTotal);
          if (!series.length || !categories.length) setEmpty(true);
          setSeries(series);
          if (month)
            setCategories(
              categories.map(
                (category) =>
                  `${category} ${languageState.texts.analytics.reducedMonths[month]}`
              )
            );
          else setCategories(languageState.texts.analytics.reducedMonths);
          // @ts-ignore
          setColors(newColors);
        } catch (err) {
          console.error(err);
          if (String(err) === "AxiosError: Network Error")
            showNotification("error", languageState.texts.errors.notConnected);
          else showNotification("error", String(err));
        }
      }
      setLoading(false);
    },
    [year, month, selectedEvent, languageState]
  );

  const localFetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetchData();
      const { list } = await response.json();
      setEventList(list);
      setSelectedEvent(list[0]);
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

  useEffect(() => {
    localFetchTriggers({});
  }, [selectedEvent]);

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

  function formatNumber(number) {
    if (number >= 1e12) {
      return (number / 1e12).toFixed(1) + "B";
    } else if (number >= 1e9) {
      return (number / 1e9).toFixed(1) + "M";
    } else if (number >= 1e6) {
      return (number / 1e6).toFixed(1) + "M";
    } else if (number >= 1e3) {
      return (number / 1e3).toFixed(1) + "k";
    } else {
      return number.toString();
    }
  }

  return (
    <div className="chart">
      <div className="flex justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div>
            <h5 className="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">
              {total}
            </h5>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {selectedEvent?.name}
            </p>
          </div>
        </div>
        <div>
          <select
            value={selectedEvent}
            className="input primary !py-0 h-[30px]"
            onChange={(e) => {
              setSelectedEvent(eventList[Number(e.target.value)]);
            }}
          >
            {eventList.map((event, i) => (
              <option key={event.id} value={i}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <Loading className="absolute top-0 left-0 w-full h-full bg-light-background dark:bg-dark-background" />
      ) : (
        <Fragment>
          {!empty ? (
            <BarChart
              series={series}
              colors={rColors}
              categories={categories}
            />
          ) : (
            <Empty />
          )}
        </Fragment>
      )}

      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
        <div className="flex justify-end gap-3 items-center pt-5">
          <select
            value={month}
            onChange={(e) => {
              setMonth(Number(e.target.value));
              localFetchTriggers({ month: Number(e.target.value) });
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
              localFetchTriggers({ month: Number(e.target.value) });
            }}
            className="input primary !py-0 h-[30px] w-[120px]"
            placeholder={languageState.texts.inputs.year}
          />
        </div>
      </div>
    </div>
  );
}

export default BarComponent;
