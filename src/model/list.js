export class List {
    constructor(list_id, list, items) {
        this.list_id = list_id;
        this.list = list;
        this.items = items;
    }
    get list_id(){
        return this.list_id;
    }
    get list(){
        return this.list;
    }
    get items(){
        return this.items;
    }
    set list_id(value) {
        this.list_id = value;
    }
    set list(value) {
        this.list = value;
    }
    set items(value) {
        this.items = value;
    }
}