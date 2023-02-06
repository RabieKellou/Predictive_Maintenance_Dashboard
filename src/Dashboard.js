import React, { useState, useEffect, useMemo, useRef } from "react";
import { List, Select, Row, Col, Card, Alert } from "antd";
import * as d3 from "d3";
import dataset from "./data/dataset.csv"
import { Header } from "antd/es/layout/layout";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import StackedBarChart from "./components/StackedBarChart";
function Dashboard() {
  let data = useRef([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [filteredData, setFilteredData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const processedData = useMemo(() => {
    return d3.csv(dataset, (row) => {
      // Convert columns as desired

      return {
        UDI: row.UDI,
        Product_ID: row["Product ID"],
        Type: row.Type,
        Air_Temperature: +row["Air temperature [K]"],
        Process_Temperature: +row["Process temperature [K]"],
        Rotational_Speed: +row["Rotational speed [rpm]"],
        Tool_Wear: +row["Tool wear [min]"],
        Machine_Failure: +row["Machine failure"],
      };
    })
  }, []);

  useEffect(() => {
    processedData.then(mydata => { data.current = mydata; setFilteredData(mydata); setSelectedProduct(data.current[0]) })
    // d3.csv("data/dataset.csv").then((data) => {
    //   setData(data);
    // });
    // console.log(data);

    // d3.csv("./data/datset.csv").row((d, i) => {

    //     return {
    //       Product_ID: d["Product ID"],
    //       Air_Temperature: +d["Air temperature [K]"],
    //       Process_Temperature: +d["Process temperature [K]"],
    //       Rotational_Speed: +d["Rotational speed [rpm]"],
    //       Tool_Wear: +d["Tool wear [min]"],
    //       Machine_Failure: +d["Machine failure"],
    //     }

    //   })
    //   .get((error, rows) => {
    //     console.log("loaded " + rows.length + " rows");
    //     if (rows.length > 0) {
    //       console.log("first row : ", rows[0]);
    //       console.log("Last  row: ", rows[rows.length - 1]);
    //     }
    //     // saving our cleaned data
    //     setData(rows)  

    //   })
  }, [processedData]);


  const handleSelectChange = (value) => {
    // Filter data based on selected value
    if (value === "running") {
      setFilteredData(data.current.filter(d => d["Machine_Failure"] === 0))
    } else if (value === "failed") {
      setFilteredData(data.current.filter(d => d["Machine_Failure"] === 1))

    } else {
      setFilteredData(data.current)
    }

  };

  const handleProductClick = (product) => {
    console.log(product);
    setSelectedProduct(product);
  };

  return (
    <div className="dashboard" style={{ padding: "10px" }}>
      <Header >
        <h3>Predictive Maintenance</h3>
      </Header>
      <Row gutter={10} style={{  textAlign: "center" }}>

        <Col span={20} push={4} >
          <Row style={{ marginBottom: "12px" }} gutter={12} >

            <Col span={4} >
              <Card title="Air Temperature"  >
                {selectedProduct.Air_Temperature + " K"}
              </Card>
            </Col>
            <Col span={5}>
              <Card title="Process Temperature" >
                {selectedProduct.Process_Temperature + " K"}
              </Card>
            </Col>
            <Col span={4}>
              <Card title="Tool Wear" >
                {selectedProduct.Tool_Wear + " Min"}
              </Card>
            </Col>
            <Col span={4}>
              <Card title="Type" >
                {selectedProduct.Type === "H" ? "High" : selectedProduct.Type === "L" ? "Low" : "Medium"}
              </Card>
            </Col>
            <Col span={5} push={2}>
              <Card title="Machine Status" >
                {selectedProduct.Machine_Failure === 1 ? <Alert
                  message="Failed"
                  type="error"
                  showIcon
                /> : <Alert
                  message="Running"
                  type="success"
                  showIcon
                />}
              </Card>
            </Col>
          </Row>
          <Row style={{
            justifyContent: "space-between"
          }}>
            <Card title="Running/Failed Machines(%)"  draggable hoverable>

              <Col span={6}>
                <PieChart data={data.current} />
              </Col>
            </Card>
            <Card title="N° Running/Failed Machines by Product Type" draggable hoverable>

              <Col span={6}>
                <StackedBarChart data={data.current} />
              </Col>
            </Card>
            <Card title="Tool Wear(min) of the latest 10 Machines" draggable hoverable>

              <Col span={10}>
                <BarChart data={data.current} />
              </Col>
            </Card>

          </Row>
          {/* <Row>
            <Col span={12}>
              <BarChart data={data.current}/>
            </Col>
           
          </Row> */}
        </Col>
        <Col span={4} pull={20} >
          <Select
            defaultValue="all"
            style={{ width: "100%" }}
            onChange={handleSelectChange}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="running">Running</Select.Option>
            <Select.Option value="failed">Failed</Select.Option>
          </Select>
          <List style={{ overflowY: "auto",height:"85vh",maxHeight:"100vh" }}
            key={(data => data.UDI)}
            dataSource={filteredData}
            pagination
            
            renderItem={(item,index) => (
              <List.Item onClick={(e) => handleProductClick(item)}  style={{ cursor: "pointer" }} defaultChecked={false}  className={selectedProduct.UDI === item.UDI ? 'ant-list-item-active' : ''}>
                {item.Product_ID+" "+ index} 
              </List.Item>
            )}
          />

        </Col>
      </Row >
    </div >
  );
}

export default Dashboard;

