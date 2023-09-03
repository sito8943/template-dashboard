import React, { Fragment, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPieChart,
  faLineChart,
  faChartColumn,
  faTrash,
  faCancel,
} from "@fortawesome/free-solid-svg-icons";

// components
import PieComponent from "../Anaylitics/PieComponent";
import LineComponent from "../Anaylitics/LineComponent";
import BarComponent from "../Anaylitics/BarComponent";

// styles
import "./style.css";

function ChartBox(onDelete) {
  const [chart, setChart] = useState(0);

  const createPie = () => setChart(1);
  const createBar = () => setChart(2);
  const createLine = () => setChart(3);

  return (
    <div className={`appear chart-box ${chart === 0 ? "min-h-[320px]" : ""}`}>
      {chart === 0 ? (
        <Fragment>
          <button onClick={createPie} type="button" className="icon-button">
            <FontAwesomeIcon icon={faPieChart} />
          </button>
          <button onClick={createBar} type="button" className="icon-button">
            <FontAwesomeIcon icon={faChartColumn} />
          </button>
          <button onClick={createLine} type="button" className="icon-button">
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
