var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Actions = function (_React$Component) {
    _inherits(Actions, _React$Component);

    function Actions(props) {
        _classCallCheck(this, Actions);

        var _this = _possibleConstructorReturn(this, (Actions.__proto__ || Object.getPrototypeOf(Actions)).call(this, props));

        console.log(props);
        _this.user = props.user;
        return _this;
    }

    _createClass(Actions, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { "class": "shopping-actions",
                    "data-user-id": this.user.user_id,
                    "data-user-account-id": this.user.user_account_id,
                    "data-user-name": this.user.user_name },
                React.createElement(
                    "div",
                    { "class": "shopping-actions-header" },
                    React.createElement(
                        "h2",
                        null,
                        "What do we need?"
                    )
                ),
                React.createElement(
                    "form",
                    { "class": "add-new-item" },
                    React.createElement("input", { type: "text", name: "item_name", placeholder: "Add something else" }),
                    React.createElement("input", { type: "submit", value: "Add" })
                )
            );
        }
    }]);

    return Actions;
}(React.Component);