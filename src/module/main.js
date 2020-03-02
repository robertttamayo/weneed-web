let account_id = 0;

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
    let url = "https://www.roberttamayo.com/shoplist/index.php";
    $.ajax(url, {
        data,
        method: "POST"
    }).then((_data)=>{
        // 
    }, (_error)=>{
        console.log('error on modify item');
        console.log(_error);
    });
});