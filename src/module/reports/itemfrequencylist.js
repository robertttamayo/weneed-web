import React from "react";
import {Card} from 'antd';

export class ItemFrequencyList extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        const today = this.props.toDate ? new Date(this.props.toDate) : new Date();
        const cards = this.props.distinct_item_count
                        .map((item) => {
                            let key = item.item_name.toLowerCase();
                            let dates = this.props.items_dates[key];
                            let count = dates.length;
                            let first = dates[0].date_added;
                            let last = dates[dates.length - 1].date_added;
                            let days = (today.getTime() - (new Date(first)).getTime()) / 1000 / 60 / 60 / 24;
                            let frequency = Math.round(days / count);
                            item.frequency = frequency;
                            item.last_added = new Date(last);
                            let users = {};
                            dates.forEach(date => {
                                if (users[`user${date.item_user_id}`]) {
                                    users[`user${date.item_user_id}`].count++;
                                } else {
                                    users[`user${date.item_user_id}`] = {
                                        count: 1,
                                        user_id: date.item_user_id,
                                        user_name: date.item_user_name
                                    };
                                }
                            });
                            let userKeys = Object.keys(users);
                            let highestUser = {
                                count: 0,
                                user_id: '',
                                user_name: '',
                            }
                            userKeys.forEach(userKey => {
                                if (users[userKey].count > highestUser.count) {
                                    highestUser = users[userKey];
                                }
                            });
                            item.users = users;
                            item.highestUser = highestUser;
                            item.item_count = parseInt(item.item_count);
                            return item;
                        })
                        .sort((a, b) => {
                            if (this.props.sortType == 'recency') {
                                if (this.props.sort == 'most') {
                                    return (a.last_added.getTime() < b.last_added.getTime()) ? 1 : -1;
                                } else {
                                    return (a.last_added.getTime() > b.last_added.getTime()) ? 1 : -1;
                                }
                            } else if (this.props.sortType == 'occurence') {
                                if (this.props.sort == 'most') {
                                    return (a.item_count < b.item_count) ? 1 : -1;
                                } else {
                                    return (a.item_count > b.item_count) ? 1 : -1;
                                }
                            } else if (this.props.sortType == 'frequency') {
                                if (this.props.sort == 'most') {
                                    return (a.frequency > b.frequency) ? 1 : -1;
                                } else {
                                    return (b.frequency < b.frequency) ? 1 : -1;
                                }
                            }
                            return 0;
                        })
                        .map((item, index)=>{
                            return (
                                <Card key={index} title={`#${index + 1}. ${item.item_name}`}>
                                    <div>Appears <span className="splash">{item.item_count}</span> times</div>
                                    <div>Added to list every <span>{item.frequency}</span> days</div>
                                    <div>Last added on {item.last_added.toString()}</div>
                                    <div>Most often added by {item.highestUser.user_name} - {item.highestUser.count} time(s)</div>
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