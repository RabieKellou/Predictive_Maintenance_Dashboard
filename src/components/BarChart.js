import React, { useEffect, useRef } from 'react'
import * as d3 from "d3"

function AxisBottom({ scale, transform }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      d3.select(ref.current).call(d3.axisBottom(scale));
    }
  }, [scale]);

  return <g ref={ref} transform={transform} />;
}

function Bars({ data, height, scaleX, scaleY }) {
  return (
    <>
      {data.map((d) => (
        <rect
          key={`bar-${d.Product_ID}`}
          x={scaleX(d.Product_ID)}
          y={scaleY(d.Tool_Wear)}
          width={scaleX.bandwidth()}
          height={height - scaleY(d.Tool_Wear)}
          fill="teal"
        />
      ))}
    </>
  );
}

function AxisLeft({ scale }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      d3.select(ref.current).call(d3.axisLeft(scale));
    }
  }, [scale]);

  return <g ref={ref} />;
}
export default function BarChart({ data }) {
  const margin = { top: 10, right: 0, bottom: 20, left: 30 };
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  data = data.slice(-10)
  const scaleX = d3.scaleBand()
    .domain(data.map((d) => d.Product_ID))
    .range([0, width])
    .padding(0.5);
  const scaleY = d3.scaleLinear()
    .domain([0, Math.max(...data.map((d) => d.Tool_Wear))])
    .range([height, 0]);

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <AxisBottom scale={scaleX} transform={`translate(0, ${height})`} />
        <AxisLeft scale={scaleY} />
        <Bars data={data} height={height} scaleX={scaleX} scaleY={scaleY} />
      </g>
    </svg>
  );
}
