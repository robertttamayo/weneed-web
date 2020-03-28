export class User {
    constructor
    (
       user_id,
       user_name,
       user_account_id,
       user_firebase_token,
       user_magicword,
       user_nickname, 
    )
    {
        this.user_id = user_id;
        this.user_name = user_name;
        this.user_account_id = user_account_id;
        this.user_firebase_token = user_firebase_token;
        this.user_magicword = user_magicword;
        this.user_nickname = user_nickname;
    }
    get user_id(){
        return this.user_id;
    }
    get user_name(){
        return this.user_name;
    }
    get user_account_id(){
        return this.user_account_id;
    }
    get user_firebase_token(){
        return this.user_firebase_token;
    }
    get user_magicword(){
        return this.user_magicword;
    }
    get user_nickname(){
        return this.user_nickname;
    }
    set user_id(value) {
        this.user_id = value;
    }
    set user_name(value) {
        this.user_name = value;
    }
    set user_account_id(value) {
        this.user_account_id = value;
    }
    set user_firebase_token(value) {
        this.user_firebase_token = value;
    }
    set user_magicword(value) {
        this.user_magicword = value;
    }
    set user_nickname(value) {
        this.user_nickname = value;
    }
}