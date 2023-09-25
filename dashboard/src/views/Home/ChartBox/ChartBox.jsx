import React, { Fragment, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPieChart,
  faLineChart,
  faChartColumn,
  faCancel,
} from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";

// components
import PieComponent from "../Anaylitics/PieComponent";
import LineComponent from "../Anaylitics/LineComponent";
import BarComponent from "../Anaylitics/BarComponent";

// styles
import "./style.css";

function ChartBox({ onDelete }) {
  const { languageState } = useLanguage();

  const [chart, setChart] = useState(0);

  const createPie = () => setChart(1);
  const createBar = () => setChart(2);
  const createLine = () => setChart(3);

  return (
    <div className={`appear chart-box ${chart === 0 ? "min-h-[320px]" : ""}`}>
      {chart === 0 ? (
        <Fragment>
          <button
            type="button"
            onClick={createPie}
            className="icon-button"
            name="create-pie-chart"
            aria-label={languageState.texts.ariaLabels.createPieChart}
          >
            <FontAwesomeIcon icon={faPieChart} />
          </button>
          <button
            type="button"
            onClick={createBar}
            className="icon-button"
            name="create-bar-chart"
            aria-label={languageState.texts.ariaLabels.createBarChart}
          >
            <FontAwesomeIcon icon={faChartColumn} />
          </button>
          <button
            type="button"
            onClick={createLine}
            className="icon-button"
            name="create-line-chart"
            aria-label={languageState.texts.ariaLabels.createLineChart}
          >
            <FontAwesomeIcon icon={faLineChart} />
          </button>
        </Fragment>
      ) : (
        <div className="w-full">
          <button
            type="button"
            className="icon-button absolute top-0 right-0 !text-error"
            onClick={onDelete}
          >
            <FontAwesomeIcon icon={faCancel} />
          </button>
          {chart === 1 ? <PieComponent /> : null}
          {chart === 2 ? <BarComponent /> : null}
          {chart === 3 ? <LineComponent /> : null}
        </div>
      )}
    </div>
  );
}

export default ChartBox;
