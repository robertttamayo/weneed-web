import React from "react";
import {endpoints} from "./endpoints";

export class Lists extends React.Component {
  constructor(props){
    super(props);
    this.updateItem = this.updateItem.bind(this);
    this.toggleCheckboxText = this.toggleCheckboxText.bind(this);
  
  }
  toggleCheckboxText(event) {
    
  }
  updateItem(data) {
    
  }
  render() {
    this.listLists = this.props.lists.map((list)=>
        <li>
            {list.list_name}
            <div className="list-dropdown">
                implied list goes here
            </div>
        </li>
    );
    return (
        <div className="shopping-list-section">
          <div className="shopping-list-wrap">
            <ul>
              {this.listLists}
            </ul>
          </div>
        </div>
    );
  }
}
