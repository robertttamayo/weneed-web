class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {username: '', password: ''};

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
    let url = "http://www.roberttamayo.com/shoplist/login.php";
    fetch(url, {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8;"
        },
        body: `username=${this.state.username}&password=${this.state.password}`
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (data.length && data.length == 1) {
          console.log(data);
          console.log('successful login');
          setCookie('weneed_user', JSON.stringify(data), 365);
          $('body').removeClass('login-modal-visible');
          $(document).trigger('login_successful');
        } else {
          alert("Sorry, the username or password was incorrect.");
        }
        // ReactDOM.render(React.createElement(ShoppingList, { items: data }), document.getElementById('shopping-list-container'));
    }).catch(function (error) {});
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
$(document).on('sign_in_triggered', function(){
  console.log('sign in triggered handler.');
    ReactDOM.render(<LoginForm />, document.getElementById('login-modal'));
    $('body').addClass('login-modal-visible');
});
