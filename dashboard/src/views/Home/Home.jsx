import { useState } from "react";
import { v4 } from "uuid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

// components
import ChartBox from "./ChartBox/ChartBox";

function Home() {
  const { languageState } = useLanguage();

  const [charts, setCharts] = useState([{ id: v4() }]);

  const addChartBox = () => setCharts([...charts, { id: v4() }]);
  const deleteChart = (i) => {
    const newArray = [...charts];
    newArray.splice(i, 1);
    setCharts(newArray);
  };

  return (
    <main className="dark:bg-dark-background bg-light-background w-full rounded-s-xl h-full p-5 flex flex-col gap-5 relative">
      <h2>{languageState.texts.analytics.title}</h2>
      {charts.map((chart, i) => (
        <ChartBox key={chart.id} onDelete={() => deleteChart(i)} />
      ))}
      <button
        type="button"
        onClick={addChartBox}
        name="add-chart"
        aria-label={languageState.texts.ariaLabels.addChart}
        className="chart-box appear !min-h-[120px]"
      >
        <FontAwesomeIcon icon={faAdd} className="icon-button" />
      </button>
    </main>
  );
}

export default Home;
