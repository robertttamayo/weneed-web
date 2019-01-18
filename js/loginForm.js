var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoginForm = function (_React$Component) {
  _inherits(LoginForm, _React$Component);

  function LoginForm(props) {
    _classCallCheck(this, LoginForm);

    var _this = _possibleConstructorReturn(this, (LoginForm.__proto__ || Object.getPrototypeOf(LoginForm)).call(this, props));

    _this.state = { username: '', password: '' };

    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(LoginForm, [{
    key: 'handleChange',
    value: function handleChange(event) {
      var target = event.target;
      var value = target.type === 'checkbox' ? target.checked : target.value;
      var name = target.name;
      this.setState(_defineProperty({}, name, value));
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      event.preventDefault();
      var url = "http://www.roberttamayo.com/shoplist/login.php";
      fetch(url, {
        method: 'post',
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8;"
        },
        body: 'username=' + this.state.username + '&password=' + this.state.password
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.length && data.length == 1) {
          setCookie('weneed_user', JSON.stringify(data), 365);
          $('body').removeClass('login-modal-visible');
          $(document).trigger('login_successful');
        } else {
          alert("Sorry, the username or password was incorrect.");
        }
        // ReactDOM.render(React.createElement(ShoppingList, { items: data }), document.getElementById('shopping-list-container'));
      }).catch(function (error) {});
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'form',
        { onSubmit: this.handleSubmit },
        React.createElement(
          'label',
          null,
          'Username:',
          React.createElement('input', { type: 'text', placeholder: 'Enter your username', name: 'username', value: this.state.value, onChange: this.handleChange })
        ),
        React.createElement(
          'label',
          null,
          'Password:',
          React.createElement('input', { type: 'password', placeholder: 'Enter your password', name: 'password', value: this.state.password, onChange: this.handleChange })
        ),
        React.createElement('input', { type: 'submit', name: 'submit', value: 'Sign In' }),
        React.createElement('input', { type: 'button', name: 'createaccount', value: 'Create Account' })
      );
    }
  }]);

  return LoginForm;
}(React.Component);

$(document).on('sign_in_triggered', function () {
  console.log('sign in triggered handler.');
  ReactDOM.render(React.createElement(LoginForm, null), document.getElementById('login-modal'));
  $('body').addClass('login-modal-visible');
});