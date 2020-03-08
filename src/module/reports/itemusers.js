import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

export class ItemUsers extends PureComponent {

  render() {
    const transactions = this.props.user_transactions;
    let userData = {};
    let usernames = [];
    transactions.forEach(item => {
      if (userData[item.user_name]) {} else {
        let data = {name: item.user_name};
        userData[item.user_name] = data;
        if (usernames.indexOf(item.user_name) == -1) {
          usernames.push(item.user_name);
        }
      }
      userData[item.user_name][item.user_transaction] = parseInt(item.user_transaction_count);
    });
    let barChartData = [];
    usernames.forEach(username => {
      barChartData.push(userData[username]);
    });
    return (
      <>
        <h2>User Stats</h2>
        <BarChart
          width={320}
          height={320}
          data={barChartData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="purchased" fill="#8884d8" />
          <Bar dataKey="added" fill="#82ca9d" />
        </BarChart>
      </>
    );
  }
}
