import React from "react";
import {endpoints} from "./endpoints";

export class Actions extends React.Component {
    constructor(props) {
        super(props);

        this.addNewItem = this.addNewItem.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            item_name: '',
        }
    }
    onChange(event){
        this.setState({[event.target.name]: event.target.value});
    }
    addNewItem(event){
        event.preventDefault();
        let formData = new FormData(event.target);

        $.ajax(endpoints.main, {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8;"
            },
            data: {
                action: "new_item",
                item_name: formData.get('item_name'),
                account_id: this.props.user.user_account_id,
                user_id: this.props.user.user_id
            }
        }).then((response) => {
            let itemData = JSON.parse(response);
            let item = {
                account_id: itemData.item_account_id,
                account_name: "",
                item_account_id: itemData.item_account_id,
                item_date_added: itemData.item_date_added,
                item_id: itemData.item_id,
                item_is_purchased: "0",
                item_name: itemData.item_name,
                item_user_id: itemData.item_user_id
            }
            $('input[name="item_name"]').val('').focus();
            this.props.onAddToList(item);
            // $(document).trigger('add_item', itemData);
        });
    }
    render() {
        const { user } = this.props;
        if (user) {
            return(
                <div className="shopping-actions"
                data-user-id={user.user_id}
                data-user-account-id={user.user_account_id}
                data-user-name={user.user_name}
                >
                    <div className="shopping-actions-header">
                        <h2>What do we need?</h2>
                    </div>
                    <form method="post" className="add-new-item" onSubmit={this.addNewItem}>
                        <input required 
                        type="text" 
                        value={this.state.item_name} 
                        onChange={this.onChange} 
                        name="item_name" 
                        placeholder="Add something else"/> 

                        <input type="submit" value="Add"/>
                    </form>
                </div>
            );
        } else {
            return '';
        }
    }
}
