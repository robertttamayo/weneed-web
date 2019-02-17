class Actions extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.user = props.user;
        this.endpoint = "http://www.roberttamayo.com/shoplist/index.php";
        this.addNewItem = this.addNewItem.bind(this);
    }
    addNewItem(event){
        event.preventDefault();
        let data = new FormData(event.target);
        let post = {
            action: "new_item",
            item_name: data.get('item_name'),
            account_id: this.user.user_account_id,
            user_id: this.user.user_id
        }
        
        let urlParameters = Object.entries(post).map(e => e.join('=')).join('&');
        console.log(urlParameters);
        console.log(post);
        fetch(this.endpoint, {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8;"
            },
            body: urlParameters
        })
        .then(response => response.json())
        .then(function(data){
            console.log(data);
            let _data = {
                account_id: data.item_account_id,
                account_name: "",
                item_account_id: data.item_account_id,
                item_date_added: data.item_date_added,
                item_id: data.item_id,
                item_is_purchased: "0",
                item_name: data.item_name,
                item_user_id: data.item_user_id
            }
            $('input[name="item_name"]').val('').focus();
            $(document).trigger('add_item', _data);
        }).catch(function(error){});
    }
    render() {
        return(
            <div class="shopping-actions"
            data-user-id={this.user.user_id}
            data-user-account-id={this.user.user_account_id}
            data-user-name={this.user.user_name}
            >
                <div class="shopping-actions-header">
                    <h2>What do we need?</h2>
                </div>
                <form method="post" class="add-new-item" onSubmit={this.addNewItem}>
                    <input required type="text" name="item_name" placeholder="Add something else"/> 
                    <input type="submit" value="Add"/>
                </form>
            </div>
        );
    }
}
