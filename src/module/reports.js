import React from "react";

import { Tabs } from "antd";
import { withRouter } from "react-router";

class Main extends React.Component {
    constructor(props){
        super(props);
        this.fetchAllItems = this.fetchAllItems.bind(this);
    }
    backToList(){
        this.props.history.push('/');
    }
    fetchAllItems(){

    }
    render(){
        return (
            <div className="reporting">
                <h1>Reports</h1>
                
            </div>
        )
    }
}

export const Reports = withRouter(Main);