export class Item {
    constructor
    (
        item_id,
        item_name,
        item_date_added,
        item_is_purchased,
        item_user_id,
        item_account_id,
        item_date_purchased,
        item_purchased_by
    )
    {
        this.item_id = item_id;
        this.item_name = item_name;
        this.item_date_added = item_date_added;
        this.item_is_purchased = item_is_purchased;
        this.item_user_id = item_user_id;
        this.item_account_id = item_account_id;
        this.item_date_purchased = item_date_purchased;
        this.item_purchased_by = item_purchased_by;
    }
    get item_id(){
        return this.item_id;
    }
    get item_name(){
        return this.item_name;
    }
    get item_date_added(){
        return this.item_date_added;
    }
    get item_is_purchased(){
        return this.item_is_purchased;
    }
    get item_user_id(){
        return this.item_user_id;
    }
    get item_account_id(){
        return this.item_account_id;
    }
    get item_date_purchased(){
        return this.item_date_purchased;
    }
    get item_purchased_by(){
        return this.item_purchased_by;
    }
    set item_id(value) {
        this.item_id = value;
    }
    set item_name(value) {
        this.item_name = value;
    }
    set item_date_added(value) {
        this.item_date_added = value;
    }
    set item_is_purchased(value) {
        this.item_is_purchased = value;
    }
    set item_user_id(value) {
        this.item_user_id = value;
    }
    set item_account_id(value) {
        this.item_account_id = value;
    }
    set item_date_purchased(value) {
        this.item_date_purchased = value;
    }
    set item_purchased_by(value) {
        this.item_purchased_by = value;
    }
}