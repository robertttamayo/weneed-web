import React, { PureComponent } from 'react';
import {
  PieChart, Pie, Legend, Tooltip,
} from 'recharts';


export class ItemPieChart extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            distinct_item_count: this.props.distinct_item_count
        }
        this.data01 = [
            { name: 'Group A', value: 400 }, { name: 'Group B', value: 300 },
            { name: 'Group C', value: 300 }, { name: 'Group D', value: 200 },
            { name: 'Group E', value: 278 }, { name: 'Group F', value: 189 },
          ];
    }
    render() {
        const frequencyData = this.props.distinct_item_count ? this.props.distinct_item_count : [];
        return (
            <div className="item-pie-chart">
                <h2>
                    {this.state.distinct_item_count && `Top ${this.state.distinct_item_count.length} Items`}
                </h2>
                <PieChart width={320} height={320}>
                    <Pie 
                        key={this.props.chartRenderKey}
                        dataKey="value" 
                        isAnimationActive={false} 
                        data={frequencyData}
                        cx={160} cy={160} 
                        outerRadius={80} 
                        fill="#8884d8" 
                        label />
                    <Tooltip />
                </PieChart>
            </div>
        );
    }
}
