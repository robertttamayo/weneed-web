var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Header = function (_React$Component) {
    _inherits(Header, _React$Component);

    function Header(props) {
        _classCallCheck(this, Header);

        var _this = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, props));

        _this.state = {
            username: '',
            password: '',
            hasUserInfo: false
        };

        _this.handleSignOut = _this.handleSignOut.bind(_this);
        _this.handleSignIn = _this.handleSignIn.bind(_this);

        _this.getUserData();
        $(document).on('login_successful', function () {
            console.log('login success, getting user data');
            _this.getUserData();
        });
        return _this;
    }

    _createClass(Header, [{
        key: 'getUserData',
        value: function getUserData() {
            console.log('get user data');
            var data = getCookie('weneed_user');
            if (data != '') {
                data = JSON.parse(data)[0];

                if (data.user_name) {
                    this.state.username = data.user_name;
                    if (data.user_id) {
                        this.state.user_id = data.user_id;
                    }
                    this.state.hasUserInfo = true;
                } else {
                    this.state.username = '';
                    this.state.hasUserInfo = false;
                }
            } else {
                this.state.username = '';
                this.state.hasUserInfo = false;
            }
        }
    }, {
        key: 'handleSignOut',
        value: function handleSignOut() {
            console.log('sign out triggered');
            setCookie('weneed_user', '[{}]', 365);
            this.state.hasUserInfo = false;
            this.state.username = '';
        }
    }, {
        key: 'handleSignIn',
        value: function handleSignIn() {
            $(document).trigger('sign_in_triggered');
            // open a modal for sign in / create account
            // ReactDOM.render(<LoginForm />, document.getElementById('login-modal'));
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.hasUserInfo) {
                return React.createElement(
                    'div',
                    { 'class': 'user-info' },
                    React.createElement(
                        'div',
                        { 'class': 'user-name' },
                        this.state.username
                    ),
                    React.createElement(
                        'div',
                        { 'class': 'sign-out', onClick: this.handleSignOut },
                        'Sign Out'
                    )
                );
            } else {
                return React.createElement(
                    'div',
                    { 'class': 'user-info' },
                    React.createElement(
                        'div',
                        { 'class': 'sign-in', onClick: this.handleSignIn },
                        'Sign In'
                    )
                );
            }
        }
    }]);

    return Header;
}(React.Component);

ReactDOM.render(React.createElement(Header, null), document.getElementById('header-actions'));