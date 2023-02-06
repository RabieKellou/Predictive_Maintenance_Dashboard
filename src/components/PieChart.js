import React from 'react'
import * as d3 from "d3"
function PieChart({ data }) {

    // Calculate the percentage of running and failed products
    const running = data.filter(d => d.Machine_Failure === 0).length;
    const failed = data.filter(d => d.Machine_Failure === 1).length;
    const total = running + failed;
    const runningPercentage = (running / total) * 100;
    const failedPercentage = (failed / total) * 100;

    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    // Create pie chart using D3
    const pie = d3
        .pie()
        .sort(null)
        .value(d => d.value);

    const color = d3
        .scaleOrdinal()
        .domain(["Running", "Failed"])
        .range(["#52C41A", "#FF4D4F"]);

    const arc = d3
        .arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    const labelArc = d3
        .arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    const chartData = pie([
        { name: "Running", value: runningPercentage },
        { name: "Failed", value: failedPercentage }
    ]);
    return (
        <div style={{display:"grid"}}>
            <svg width={width} height={height}>
                <g
                    transform={`translate(${width / 2}, ${height / 2})`}
                    style={{ margin: "auto" }}
                >
                    {chartData.map((d, i) => (
                        <g key={i} className="arc">
                            <path d={arc(d)} fill={color(d.data.name)} />
                            <text
                                transform={`translate(${labelArc.centroid(d)})`}
                                textAnchor="middle"
                                fontWeight="bold"   
                                fill='#fff'
                            >
                                {`${d.data.value}%`}
                             

                            </text>
                        </g>
                    ))}
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
        </div>
    )
}

export default PieChart