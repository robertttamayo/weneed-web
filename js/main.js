var account_id = 0;

function init() {
    if (!checkHasUserCookie()) {
        $(document).trigger('sign_in_triggered');
        return;
    }
    var url = "http://www.roberttamayo.com/shoplist/index.php";
    fetch(url, {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8;"
        },
        body: 'account_id=' + account_id + '&action=get_items'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        ReactDOM.render(React.createElement(ShoppingList, { items: data }), document.getElementById('shopping-list-container'));
        var user_data = JSON.parse(getCookie('weneed_user'))[0];
        ReactDOM.render(React.createElement(Actions, { user: user_data }), document.getElementById('shopping-list-actions'));
    }).catch(function (error) {});
}
init();

$(document).on('login_successful', loadUserData);
$(document).on('init_list', loadUserData);

function checkHasUserCookie() {
    var _data = getCookie('weneed_user');
    try {
        var data = JSON.parse(_data)[0];
        account_id = data.user_account_id;
        return true;
    } catch (e) {
        return false;
    }
}
function loadUserData() {
    checkHasUserCookie();
    init();
}