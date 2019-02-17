var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ShoppingList = function (_React$Component) {
  _inherits(ShoppingList, _React$Component);

  function ShoppingList(props) {
    _classCallCheck(this, ShoppingList);

    var _this = _possibleConstructorReturn(this, (ShoppingList.__proto__ || Object.getPrototypeOf(ShoppingList)).call(this, props));

    _this.list = props.items;
    console.log(_this.list);
    _this.listItems = _this.list.map(function (item) {
      return React.createElement(
        "div",
        null,
        item.item_name
      );
    });
    $(document).on('add_item', function (event, item) {
      _this.list.unshift(item);
      _this.setState({ list: _this.list });
    });
    return _this;
  }

  _createClass(ShoppingList, [{
    key: "formatDate",
    value: function formatDate(date) {
      var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      return monthNames[monthIndex] + " " + day;
    }
  }, {
    key: "toggleCheckboxText",
    value: function toggleCheckboxText(event) {
      console.log(event.target);
      var $target = $(event.target).filter('input[type="checkbox"]');
      if ($target.length) {
        $target.parent().toggleClass('is-purchased');
        var item_id = $target.parent().attr('data-purchased-item-id');
        if ($target.parent().hasClass('is-purchased')) {
          $target.parent().find('label').text('Got it!');
          $(document).trigger('modify_item', {
            item_id: item_id,
            action: 'modify_item',
            item_is_purchased: "1"
          });
        } else {
          $target.parent().find('label').text('Got it?');
          $(document).trigger('modify_item', {
            item_id: item_id,
            action: 'modify_item',
            item_is_purchased: "0"
          });
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      this.listItems = this.list.map(function (item) {
        var _React$createElement;

        return React.createElement(
          "li",
          (_React$createElement = {
            "data-item-id": item.item_id,
            "data-item-account-id": item.item_account_id,
            "data-account-name": item.account_name,
            "data-item-date-added": item.item_date_added
          }, _defineProperty(_React$createElement, "data-item-id", item.item_id), _defineProperty(_React$createElement, "data-item-is-purchased", item.item_is_purchased), _defineProperty(_React$createElement, "data-item-name", item.item_name), _defineProperty(_React$createElement, "data-item-user-id", item.item_user_id), _React$createElement),
          React.createElement(
            "div",
            { "class": "item-list-top" },
            React.createElement(
              "span",
              { "class": "item-list-name" },
              item.item_name
            ),
            React.createElement(
              "span",
              { "class": "item-list-purchased", "data-purchased-item-id": item.item_id, onClick: _this2.toggleCheckboxText },
              React.createElement(
                "label",
                { "for": 'item-checkbox' + item.item_id },
                "Got it?"
              ),
              React.createElement("input", { id: 'item-checkbox' + item.item_id, type: "checkbox", name: 'item-checkbox' + item.item_id })
            )
          ),
          React.createElement(
            "div",
            { "class": "item-list-bottom" },
            React.createElement(
              "span",
              { "class": "item-list-added-on" },
              "Added ",
              _this2.formatDate(new Date(item.item_date_added))
            )
          )
        );
      });
      return React.createElement(
        "div",
        { "class": "shopping-list-section" },
        React.createElement(
          "div",
          { "class": "shopping-list-wrap" },
          React.createElement(
            "ul",
            null,
            this.listItems
          )
        )
      );
    }
  }]);

  return ShoppingList;
}(React.Component);