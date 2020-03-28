export class Account {
    constructor
    (
        account_id,
        account_name,
        items,
        users,
    )
    {
        this.account_id = account_id;
        this.account_name = account_name;
        this.items = items;
        this.users = users;
    }
    get account_id(){
        return this.account_id;
    }
    get account_name(){
        return this.account_name;
    }
    get items(){
        return this.items;
    }
    get users(){
        return this.users;
    }
    set account_id(value) {
        this.account_id = value;
    }
    set account_name(value) {
        this.account_name = value;
    }
    set items(value) {
        this.items = value;
    }
    set users(value) {
        this.users = value;
    }
}