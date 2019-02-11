class Actions extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.user = props.user;
    }
    render() {
        return(
            <div class="shopping-actions"
            data-user-id={this.user.user_id}
            data-user-account-id={this.user.user_account_id}
            data-user-name={this.user.user_name}>
                <div class="shopping-actions-header">
                    <h2>What do we need?</h2>
                </div>
                <form class="add-new-item">
                    <input type="text" name="item_name" placeholder="Add something else"/> 
                    <input type="submit" value="Add"/>
                </form>
            </div>
        );
    }
}