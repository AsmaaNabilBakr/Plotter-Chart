import React from "react";
import axios from "axios";
import "./App.scss";
import SideBar from "./sections/sidebar";
import Graph from "./sections/chart";
export interface IAppStats {
  SideBarMenu: any[];
}
class App extends React.Component<{}, IAppStats> {
  constructor(props) {
    super(props);
    this.state = {
      SideBarMenu: [],
    };
  }

  componentDidMount() {
    // Simple GET request using axios
    axios.get("https://plotter-task.herokuapp.com/columns").then((response) => {
      this.setState({ SideBarMenu: response.data });
    });
  }
  
  render() {
      return (
      this.state.SideBarMenu.length > 0 && (
        <div className="App">
          <SideBar menu={this.state.SideBarMenu} />
          <Graph />
        </div>
      )
    );
  }
}

export default App;
