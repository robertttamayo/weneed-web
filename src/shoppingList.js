class ShoppingList extends React.Component {
  renderList(){
    return (<li>An item</li>);
  }
    render() {
      return (
        <div class="shopping-list-section">
          <h1>Shopping List</h1>
          <div class="shopping-list-wrap">
            {renderList()}
          </div>
        </div>
      );
    }
  }