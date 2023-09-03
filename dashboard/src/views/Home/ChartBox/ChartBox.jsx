import React, { Fragment, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPieChart,
  faLineChart,
  faChartColumn,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// components
import PieComponent from "../Anaylitics/PieComponent";
import LineComponent from "../Anaylitics/LineComponent";
import BarComponent from "../Anaylitics/BarComponent";

function ChartBox() {
  const [chart, setChart] = useState(0);

  const createPie = () => setChart(1);
  const createBar = () => setChart(2);
  const createLine = () => setChart(3);

  const deleteChart = () => setChart(0);

  return (
    <div className="aGrow relative flex-[50%] rounded-lg border-dashed border-primary border-2 min-h-[320px] flex items-center justify-center">
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
        <div className="w-full h-full">
          <button
            type="button"
            onClick={deleteChart}
            className="icon-button !text-error !text-sm absolute top-0 right-0"
          >
            <FontAwesomeIcon icon={faTrash} />
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
