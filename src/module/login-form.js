import React from "react";
import { endpoints } from "./endpoints";
import {setCookie} from "./cookies";
import { withRouter } from "react-router";

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    $.ajax(endpoints.login, {
      method: 'POST',
      data: {
        username: this.state.username,
        password: this.state.password,
      }
    }).then((response) => {
      try {
        let data = JSON.parse(response);
        if (data.length && data.length == 1) {
          setCookie('weneed_user', JSON.stringify(data), 365);
          $(document).trigger('register_user_db', {
            user_name: data[0].user_name,
            user_id: data[0].user_id,
            user_account_id: data[0].user_account_id,
          });
          this.props.onLogin();
          this.props.history.push('/');
        } else {
          alert("Sorry, the username or password was incorrect.");
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input type="text" placeholder="Enter your username" name="username" value={this.state.value} onChange={this.handleChange} />
        </label>
        <label>
          Password:
          <input type="password" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} />
        </label>
        <input type="submit" name="submit" value="Sign In" />
        <input type="button" name="createaccount" value="Create Account" />
      </form>
    );
  }
}

export const LoginForm = withRouter(Main);
