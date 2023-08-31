import { useState, useCallback, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useUser } from "../../contexts/UserProvider";
import { useLanguage } from "../../contexts/LanguageProvider";
import { useNotification } from "../../contexts/NotificationProvider";

// services
import { fetchEvents, fetchTriggers } from "../../services/analytics";

// components
import Loading from "../../components/Loading/Loading";
import LineChart from "../../components/Charts/LineChart";

function Home() {
  const navigate = useNavigate();

  const { userState } = useUser();
  const { languageState } = useLanguage();

  const { setNotificationState } = useNotification();

  const [loading, setLoading] = useState(true);

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
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(0);
  const [date, setDate] = useState(new Date().getTime());

  const localFetchTriggers = useCallback(
    async (list) => {
      try {
        const response = await fetchTriggers(year, month, day, date, list);
      } catch (err) {
        console.error(err);
        if (String(err) === "AxiosError: Network Error")
          showNotification("error", errors.notConnected);
        else showNotification("error", String(err));
      }
      setLoading(false);
    },
    [year, month, day, date]
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
        showNotification("error", errors.notConnected);
      else showNotification("error", String(err));
    }
  };

  useEffect(() => {
    if (!userState.user) navigate("/auth/");
    else localFetchEvents();
  }, [userState]);

  const prepareColor = (color) => `text-[${color}]`;

  const printEvents = useMemo(() => {
    return eventList.map((event) => (
      <div>
        <h5 className="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
          {event.name}{" "}
          <span
            className={`${prepareColor(event.color)} ml-1 -mt-[5px] text-4xl`}
          >
            •
          </span>
        </h5>
        <p className="text-gray-900 dark:text-white text-2xl leading-none font-bold">
          {event.count}
        </p>
      </div>
    ));
  }, [eventList]);

  return (
    <main className="dark:bg-dark-background bg-light-background w-full rounded-s-xl h-full p-5 flex flex-col flex-wrap gap-5">
      <h2>{languageState.texts.analytics.title}</h2>
      {loading ? <Loading /> : null}
      <div className="w-full bg-light-background2 rounded-lg shadow dark:bg-dark-background2 p-4 md:p-6">
        <div className="flex justify-between mb-5">
          <div className="grid gap-4 grid-cols-2">{printEvents}</div>

          <div>
            <button
              id="dropdownDefaultButton"
              data-dropdown-toggle="lastDaysdropdown"
              data-dropdown-placement="bottom"
              type="button"
              className="px-3 py-2 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Last week{" "}
              <svg
                className="w-2.5 h-2.5 ml-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div
              id="lastDaysdropdown"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Yesterday
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Today
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Last 7 days
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Last 30 days
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Last 90 days
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <LineChart />
        <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mt-2.5">
          <div className="pt-5">
            <Link to="/" className="button primary">
              <FontAwesomeIcon icon={faFile} className="mr-2" />
              {languageState.texts.analytics.actions.fullReport}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
