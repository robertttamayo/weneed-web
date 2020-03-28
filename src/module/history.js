import React from "react";

import { Timeline, Input, Checkbox, DatePicker, Radio, PageHeader } from "antd";
import { endpoints } from "./endpoints";

import { filterItemHistory } from '../util/filterhistory';

import { withRouter } from "react-router";

class Main extends React.Component {
    constructor(props){
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handlePurchasedRadioChange = this.handlePurchasedRadioChange.bind(this);
        this.backToList = this.backToList.bind(this);

        this.red = "#b3005a";
        this.green = "#00b359";
        this.blue = "#0066cc";

        this.radioStyle = {
            display: 'block',
            height: '40px',
            lineHeight: '40px'
        }

        this.state = {
            item_history: [],
            loading: true,
            searchTerm: '',
            searchDate: '',
            item_filter: 'all',
        }
    }
    handlePurchasedRadioChange(event) {
        this.setState({item_filter: event.target.value});
    }
    handleOnChange(event){
        this.setState({searchTerm: event.target.value});
    }
    backToList(){
        this.props.history.push('/');
    }
    render(){
        let previousDate = '';
        
        const filteredList = filterItemHistory(
            this.state.item_history,
            this.state.searchTerm, 
            this.state.item_filter
        );
        
        const purchaseTimelineItems = (filteredList.map((item, index)=> {
            let date = item.item_date == previousDate ? '' : `${item.item_date}`;
            if (previousDate != item.item_date) {
                previousDate = item.item_date;
            }
            let color = this.green;
            let status = item.item_status;
            let message = 'added';
            if (status == 'blue') {
                color = this.blue;
                message = 'purchased';
            }
            return (
                <Timeline.Item key={index} label={date} color={color}>
                    <b>{item.item_name}</b> {message}
                </Timeline.Item>
            )
        }));
        return (
            <>
                <PageHeader
                    ghost={true}
                    onBack={this.backToList}
                    title="History"
                    subTitle="View shopping history"
                    ></PageHeader>
                <div className="shopping-history-container">
                    <div className="searchHistory">
                        <Input placeholder="Search your history" onChange={this.handleOnChange} value={this.state.searchTerm}/>
                    </div>
                    <div className="filters">
                        <Radio.Group onChange={this.handlePurchasedRadioChange}>
                            <Radio style={this.radioStyle} value="all">Show all</Radio>
                            <Radio style={this.radioStyle} value="purchased">Show date purchased only</Radio>
                            <Radio style={this.radioStyle} value="added">Show date added only</Radio>
                        </Radio.Group>
                    </div>
                    <div className="timeline">
                        {this.state.loading ? (
                            <div> Loading history... </div>
                        ) : (
                            <>
                                <div className="timeline-top">
                                    <div>Date</div>
                                    <div>Item &amp; action</div>
                                </div>
                                <Timeline mode="left">
                                    {purchaseTimelineItems}
                                </Timeline>
                            </>
                        )}
                        
                    </div>
                </div>
            </>
        )
    }
    componentDidMount(){
        $.ajax(endpoints.main, {
            method: "POST",
            data: {
                account_id: this.props.user.user_account_id,
                action: 'get_history',
            },
        }).then((results) => {
            let item_history = JSON.parse(results);
            item_history.forEach((item)=>item.item_name_lc = item.item_name.toLowerCase());
            this.setState({
                item_history,
                loading: false
            });
        });
    }
}

export const ShoppingHistory = withRouter(Main);