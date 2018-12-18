function init() {
    let url = "http://www.roberttamayo.com/shoplist/index.php";
    fetch(url, {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8;"
        },
        body: 'account_id=1&action=get_items'
    })
    .then(response => response.json())
    .then(function(data){
        console.log(data);
        console.log('data is recieve');
        ReactDOM.render(<ShoppingList items={data} />, document.getElementById('shopping-list-container'));
    }).catch(function(error){});
}
init();
