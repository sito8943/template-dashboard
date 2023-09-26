import React, { useEffect, useState } from "react";

function BarChart({ series, categories }) {
  const [rChart, setRChart] = useState();

  useEffect(() => {
    if (rChart) rChart?.destroy();
    var options = {
      series,
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "70%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val;
        },
        offsetY: 20,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories,
      },
      yaxis: {
        title: {},
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    };

    if (
      document.getElementById("column-chart") &&
      typeof ApexCharts !== "undefined"
    ) {
      const chart = new ApexCharts(
        document.getElementById("column-chart"),
        options
      );
      chart.render();
      setRChart(chart);
    }
    return () => {
      if (rChart) rChart?.destroy();
    };
  }, [series, categories]);

  return <div id="column-chart"></div>;
}

BarChart.defaultProps = {
  series: [
    {
      name: "Net Profit",
      data: [0, 44, 55, 57, 56, 61, 58, 63, 60, 66, 0, 0],
    },
  ],
};

export default BarChart;
