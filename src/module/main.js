let account_id = 0;

console.log("this file is part of the app");
init();

$(document).on('login_successful', loadUserData);
$(document).on('init_list', loadUserData);

function checkHasUserCookie(){
    let _data = getCookie('weneed_user');
    try {
        let data = JSON.parse(_data)[0];
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

$(document).on('modify_item', function(event, data){
    console.log('modify_item triggered');
    console.log(data);
    let url = "https://www.roberttamayo.com/shoplist/index.php";
    $.ajax(url, {
        data,
        method: "POST"
    }).then((_data)=>{
        console.log('modified item succesfully');
        console.log(_data);
        // $(document).trigger('update_items_db', {items});
    }, (_error)=>{
        console.log('error on modify item');
        console.log(_error);
    });
});