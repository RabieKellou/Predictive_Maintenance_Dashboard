import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";


function sum(values) {
    return values.reduce((prev, value) => prev + value, 0);
}

export default function StackedBarChart({ data }) {
    const [tooltip, setTooltip] = useState(null);

    let dataset = d3.rollup(data, v => {
        return {
            running: d3.sum(v, d => d.Machine_Failure === 0),
            failed: d3.sum(v, d => d.Machine_Failure === 1),
        }
    }, d => d.Type)
    // console.log(Array.from(dataset, ([key, value]) => ({ type: key, ...value })));

    dataset = Array.from(dataset, ([key, value]) => ({ type: key, ...value })).sort((a, b) => (a.running - a.failed) - (b.running - b.failed));
    const axisBottomRef = useRef(null);
    const axisLeftRef = useRef(null);

    const margin = { top: 10, right: 0, bottom: 20, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;


    const max = Math.max(
        ...dataset.map((el) =>
            sum([el.running, el.failed].map(Number))
        ));
    const scaleX = d3.scaleBand().domain(dataset.map(d => d.type)).range([0, width]).padding(0.3);
    const scaleY = d3.scaleLinear().domain([0, max]).range([height, 0]);
    const color = d3
        .scaleOrdinal()
        .domain(["running", "failed"])
        .range(["#52C41A", "#FF4D4F"]);
    const subgroups = ["running", "failed"];
    // const stacked = d3.stack().keys(subgroups)(csv);

    useEffect(() => {
        if (axisBottomRef.current) {
            d3.select(axisBottomRef.current).call(d3.axisBottom(scaleX));
        }

        if (axisLeftRef.current) {
            d3.select(axisLeftRef.current).call(d3.axisLeft(scaleY));
        }
    }, [scaleX, scaleY]);

    return (
        <div style={{ display: "grid" }}>
            <svg
                width={width + margin.left + margin.right}
                height={height + margin.top + margin.bottom}
            >
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <g ref={axisBottomRef} transform={`translate(0, ${height})`} />
                    <g ref={axisLeftRef} />
                    {subgroups.map((subgroup, index) => {
                        console.log(color(subgroup));
                        return (
                            <g key={`group-${index}`} >
                                {dataset.map((d) => {
                                    const label = String(d.type);
                                    const y0 = scaleY(0);
                                    const y1 = scaleY(d[subgroup]);

                                    return (
                                        <rect
                                            key={`rect-${label}`}
                                            x={scaleX(label)}
                                            y={y1}
                                            width={scaleX.bandwidth()}
                                            height={y0 - y1 || 0}
                                            fill={color(subgroup)}
                                            onMouseEnter={(event) => {
                                                setTooltip({
                                                    x: event.clientX,
                                                    y: event.clientY,
                                                    data:d
                                                });
                                            }}
                                            onMouseLeave={() => setTooltip(null)}
                                        />

                                    );
                                })}
                            </g>
                        );
                    })}
                </g>
            </svg>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                        style={{
                            width: 10,
                            height: 10,
                            backgroundColor: "#52C41A",
                            borderRadius: "50%"
                        }}
                    />
                    <p style={{ marginLeft: 10 }}>Running</p>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                        style={{
                            width: 10,
                            height: 10,
                            backgroundColor: "#FF4D4F",
                            borderRadius: "50%"
                        }}
                    />
                    <p style={{ marginLeft: 10 }}>Failed</p>
                </div>
            </div>
            {tooltip !== null ? (
        <div className="tooltip" style={{ top: tooltip.y, left: tooltip.x }}>
          <span className="tooltip__title">{tooltip.data.type}</span>
          <table className="tooltip__table">
            <thead>
              <tr>
                <td>Running</td>
                <td>Failed</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{tooltip.data.running}</td>
                <td>{tooltip.data.failed}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
        </div>
    );
}
