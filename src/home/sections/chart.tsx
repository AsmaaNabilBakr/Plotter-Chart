import React from "react";
import axios from "axios";
import { DropTarget } from "react-drag-drop-container";
import { Line } from "react-chartjs-2";

export interface IGraphState {
  DimensionVal: string;
  MeasureVal: string[];
  GraphResults: any[];
  xAxisData?: any[];
}

class Graph extends React.Component<{}, IGraphState> {
  constructor(props) {
    super(props);
    this.state = {
      DimensionVal: "",
      MeasureVal: [],
      GraphResults: [],
    };
  }
  //update chart data based on State changes
  public updateData = () => {
    axios
      .post("https://plotter-task.herokuapp.com/data", {
        measures: this.state.MeasureVal,
        dimension: this.state.DimensionVal,
      })
      .then((response) => {
        this.setState({
          GraphResults: response.data,
          xAxisData: response.data[0],
        });
      });
  };
  //Generate Random Colors for chart Lines
  public getRandomColor() {
    const letters = "0123456789ABCDEF".split("");
    let color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  render() {
    this.state.GraphResults.shift();
    const dataSets = this.state.GraphResults.map((item) => {
      const color = this.getRandomColor();
      return {
        label: item.name,
        data: item.values,
        fill: false,
        backgroundColor: color,
        borderColor: color,
      };
    });
    const data = {
      labels: this.state.xAxisData?.values,
      datasets: dataSets,
    };
    const dropped = (e) => {
      const Measures = this.state.MeasureVal;
      if (e.dragData.function === "dimension") {
        this.setState({ DimensionVal: e.dragData.name });
        this.updateData();
      } else if (e.dragData.function === "measure") {
        if (Measures.indexOf(e.dragData.name) === -1) {
          Measures.push(e.dragData.name);
          this.setState({ MeasureVal: Measures });
          this.updateData();
        }
      }
    };
    const clear = (name) => {
      if (name === "dimension") {
        this.setState({ DimensionVal: "" });
        if (this.state.DimensionVal == "") {
          this.updateData();
        }
      } else if (name === "measure") {
        this.setState({ MeasureVal: [] });
        if (this.state.MeasureVal.length == 0) {
          this.updateData();
        }
      }
    };
    return (
      <div className="ChartContainer">
        <div className="Inputs">
          <div className="Input-Container">
            <label>Dimensions</label>
            <DropTarget targetKey="dimension" onHit={dropped}>
              <div className="Input-Box">
                {this.state.DimensionVal.length > 0 && (
                  <span className="Input-Val">{this.state.DimensionVal}</span>
                )}
              </div>
            </DropTarget>
            {this.state.DimensionVal.length > 0 && (
              <span className="ClearBtn" onClick={() => clear("dimension")}>
                Clear
              </span>
            )}
          </div>
          <div className="Input-Container">
            <label>Measures</label>
            <DropTarget
              targetKey="measure"
              onHit={dropped}
            >
              <div
                className="Input-Box"
                // id={this.props.id}
                // onDrop={drop}
                // onDragOver={dragOver}
              >
                {this.state.MeasureVal.length > 0 &&
                  this.state.MeasureVal.map((item) => (
                    <span className="Input-Val">{item}</span>
                  ))}
              </div>
            </DropTarget>
            {this.state.MeasureVal.length > 0 && (
              <span className="ClearBtn" onClick={() => clear("measure")}>
                Clear
              </span>
            )}
          </div>
        </div>

        <div className="graphContainer">
          {this.state.DimensionVal == "" &&
          this.state.MeasureVal.length == 0 ? (
            <div className="noVal">
              <p>Kindly Add Dimension and Measure</p>
            </div>
          ) : this.state.DimensionVal == "" ? (
            <div className="noVal">
              <p>Kindly Add a Dimension</p>
            </div>
          ) : this.state.MeasureVal.length == 0 ? (
            <div className="noVal">
              <p>Kindly Add a Measure</p>
            </div>
          ) : (
            <Line data={data} type="line" className="chart" />
          )}
        </div>
      </div>
    );
  }
}

export default Graph;
