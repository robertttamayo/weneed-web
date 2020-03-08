// import React, { PureComponent } from "react";


// export class ItemPieChart extends React.Component {
//     constructor(props){
//         super(props);
//     }
//     render(){
//         return (
//             <div className="item-pie-chart">
                
//             </div>
//         )
//     }
// }
import React, { PureComponent } from 'react';
import {
  PieChart, Pie, Legend, Tooltip,
} from 'recharts';


export class ItemPieChart extends React.Component {
    constructor(props){
        super(props);
        console.log(props);
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
            console.log(frequencyData);
        return (
            <div className="item-pie-chart">
                {this.state.distinct_item_count && `Top ${this.state.distinct_item_count.length} Items`}
                <PieChart width={400} height={400}>
                    {/* <Pie dataKey="value" 
                    isAnimationActive={false} 
                    data={data01} cx={200} cy={200} 
                    outerRadius={80} 
                    fill="#8884d8" 
                    label />
                    <Tooltip /> */}
                    <Pie 
                        key={this.props.chartRenderKey}
                        dataKey="value" 
                        isAnimationActive={false} 
                        data={frequencyData}
                        cx={200} cy={200} 
                        outerRadius={80} 
                        fill="#8884d8" 
                        label />
                    <Tooltip />
                </PieChart>
            </div>
        );
    }
}
