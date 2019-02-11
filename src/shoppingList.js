class ShoppingList extends React.Component {
  constructor(props){
    super(props);
    this.list = props.items;
    this.listItems = this.list.map((item)=>
      <div>{item.item_name}</div>
    );
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
          <span class="item-list-name">{item.item_name}</span>
          <span class="item-list-purchased">Got it!</span>
        </li>
    );
    return (
        <div class="shopping-list-section">
          <h1>Shopping List</h1>
          <div class="shopping-list-wrap">
            {this.listItems}
          </div>
        </div>
    );
  }
}
