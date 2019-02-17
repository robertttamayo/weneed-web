class ShoppingList extends React.Component {
  constructor(props){
    super(props);
    this.list = props.items;
    console.log(this.list);
    this.listItems = this.list.map((item)=>
      <div>{item.item_name}</div>
    );
    $(document).on('add_item', (event, item) => {
      this.list.unshift(item);
      this.setState({list: this.list});
    });
  }

  formatDate(date) {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
  
    return `${monthNames[monthIndex]} ${day}`;
  }
  toggleCheckboxText(event) {
    console.log(event.target);
    let $target = $(event.target).filter('input[type="checkbox"]');
    if ($target.length) {
      $target.parent().toggleClass('is-purchased');
      let item_id = $target.parent().attr('data-purchased-item-id');
      if ($target.parent().hasClass('is-purchased')) {
        $target.parent().find('label').text('Got it!');
        $(document).trigger('modify_item', {
          item_id,
          action: 'modify_item',
          item_is_purchased: "1"
        });
      } else {
        $target.parent().find('label').text('Got it?');
        $(document).trigger('modify_item', {
          item_id,
          action: 'modify_item',
          item_is_purchased: "0"
        });
      }
    }
  }
  render() {
    this.listItems = this.list.map((item)=>
        <li 
        data-item-id={item.item_id}
        data-item-account-id={item.item_account_id}
        data-account-name={item.account_name}
        data-item-date-added={item.item_date_added}
        data-item-id={item.item_id}
        data-item-is-purchased={item.item_is_purchased}
        data-item-name={item.item_name}
        data-item-user-id={item.item_user_id}
        >
          <div class="item-list-top">
            <span class="item-list-name">{item.item_name}</span>
            <span class="item-list-purchased" data-purchased-item-id={item.item_id} onClick={this.toggleCheckboxText}>
              <label for={'item-checkbox' + item.item_id}>Got it?</label>
              <input id={'item-checkbox' + item.item_id} type="checkbox" name={'item-checkbox' + item.item_id}/>
            </span>
          </div>
          <div class="item-list-bottom">
            <span class="item-list-added-on">Added {this.formatDate(new Date(item.item_date_added))}</span>
          </div>
        </li>
    );
    return (
        <div class="shopping-list-section">
          <div class="shopping-list-wrap">
            <ul>
              {this.listItems}
            </ul>
          </div>
        </div>
    );
  }
}
