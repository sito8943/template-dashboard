import React, { useEffect, useState } from "react";

function LineChart({ series, categories }) {
  const [rChart, setRChart] = useState();
  useEffect(() => {
    if (rChart) rChart?.destroy();
    let options = {
      chart: {
        zoom: {
          enabled: false,
        },
        height: 350,
        maxWidth: "100%",
        type: "line",
      },
      tooltip: {
        enabled: true,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 3,
        curve: "smooth",
      },
      grid: {
        row: {
          opacity: 0.5,
        },
      },
      series,
      xaxis: {
        categories,
      },
    };

    if (
      document.getElementById("line-chart") &&
      typeof ApexCharts !== "undefined"
    ) {
      const chart = new ApexCharts(
        document.getElementById("line-chart"),
        options
      );
      chart.render();
      setRChart(chart);
    }

    return () => {
      if (rChart) rChart?.destroy();
    };
  }, [series, categories]);

  return <div className="py-4" id="line-chart"></div>;
}

LineChart.defaultProps = {
  series: [
    {
      name: "Clicks",
      data: [6500, 6418, 6456, 6526, 6356, 6456],
      color: "#1A56DB",
    },
    {
      name: "CPC",
      data: [6456, 6356, 6526, 6332, 6418, 6500],
      color: "#7E3AF2",
    },
  ],
  categories: [
    "01 Feb",
    "02 Feb",
    "03 Feb",
    "04 Feb",
    "05 Feb",
    "06 Feb",
    "07 Feb",
  ],
};
LineChart.propTypes = {};

export default LineChart;
