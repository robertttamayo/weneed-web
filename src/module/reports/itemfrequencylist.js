import React from "react";
import {Card} from 'antd';

export class ItemFrequencyList extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        const cards = this.props.distinct_item_count
                        .filter(item => item.item_count > 1)
                        .map((item, index)=>{
                            return (
                                <Card title={`#${index + 1}. ${item.item_name}`}>
                                    <div>Appears <span className="splash">{item.item_count}</span> times</div>
                                    <div>Added to list every 10 days</div>
                                    <div>Most often purchased by Robert</div>
                                </Card>
                            )
                        });
        return (
            <div className="item-frequency-list">
                {cards}
            </div>
        )
    }
}