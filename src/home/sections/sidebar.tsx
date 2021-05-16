import React from "react";
import { DragDropContainer } from "react-drag-drop-container";

export interface ISideBarProps {
  menu?: any[];
}
class SideBar extends React.Component<ISideBarProps, {}> {
  render() {
    return (
      <div className="sideBar">
        <div className="SideBar-Header">
          <p>Columns</p>
        </div>
        <div className="SideBar-Content">
          <ul>
            {this.props.menu?.map((ListItem, index) => (
              <>
                <DragDropContainer
                  dragData={ListItem}
                  targetKey={ListItem.function}
                  key={index}
                  className="listItem"
                >
                  <li 
                  id={ListItem.name}
                  key={index}
                  >
                    {ListItem.name}
                  </li>
                </DragDropContainer>
              </>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default SideBar;
