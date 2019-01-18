class ShoppingList extends React.Component {
  constructor(props){
    super(props);
    this.list = props.items;
    this.listItems = this.list.map((item)=>
      <div>{item.item_name}</div>
    );
  }
  renderList(item){
    return (<li>{item.item_name}</li>);
  }
  render() {
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
