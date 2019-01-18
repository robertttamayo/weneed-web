var account_id = 0;

function init() {
    if (!preData()) {
        return;
    }
    console.log("account_id=" + account_id + "&action=get_items");
    var url = "http://www.roberttamayo.com/shoplist/index.php";
    fetch(url, {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8;"
        },
        body: "account_id=" + account_id + "&action=get_items"
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        ReactDOM.render(React.createElement(ShoppingList, { items: data }), document.getElementById('shopping-list-container'));
    }).catch(function (error) {});
}
init();

$(document).on('login_successful', preData);
$(document).on('init_list', preData);

function preData() {
    var _data = getCookie('weneed_user');
    try {
        var data = JSON.parse(_data)[0];
        account_id = data.user_account_id;
        return true;
    } catch (e) {
        return false;
    }
}