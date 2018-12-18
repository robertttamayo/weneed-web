class ShoppingList extends React.Component {
  constructor(props){
    super(props);
    console.log(props);
    console.log('something happen');
    this.list = props.items;
    this.listItems = this.list.map((item)=>
      <li>{item.item_name}</li>
    );
    console.log(this.listItems);
  }
  renderList(item){
    console.log('item is: ' + item);
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