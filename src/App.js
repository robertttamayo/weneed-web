import React from "react";
import ReactDOM from "react-dom";
import {ShoppingList} from "./module/shopping-list";
import {LoginForm} from "./module/login-form";
import {Actions} from "./module/actions";
import {Header} from "./module/header";
import {Reports} from "./module/reports";
import {ShoppingHistory} from "./module/history";

import {endpoints} from "./module/endpoints";
import {getCookie, setCookie} from "./module/cookies";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class App extends React.Component {
    constructor(props){
        super(props);

        this.fetchItems = this.fetchItems.bind(this);
        this.onShowSignOut = this.onShowSignOut.bind(this);
        this.onShowSignIn = this.onShowSignIn.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onUpdateList = this.onUpdateList.bind(this);
        this.onAddToList = this.onAddToList.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    
        let user_data = null;

        if (getCookie('weneed_user') != '') {
            try {
                user_data = JSON.parse(getCookie('weneed_user'))[0];
            } catch (e) {
                console.error(e);
            }
        }

        this.state = {
            items: [],
            user_data,
            mobileMenuOpen: false,
        }
    }
    onLogin() {
        let user_data = JSON.parse(getCookie('weneed_user'))[0];
        this.setState({user_data});
        this.fetchItems();
    }
    onShowSignIn() {

    }
    onShowSignOut() {
        document.cookie = "weneed_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        this.setState({
            user_data: null,
            items: [],
        });
    }
    toggleMobileMenu() {
        this.setState(prevState => ({
            mobileMenuOpen: !prevState.mobileMenuOpen
        }));
    }
    updateItem(data){
        let url = endpoints.modify_item;
        $.ajax(url, {
            data,
            method: "POST"
        }).then((_data)=>{
            let items = [];
            if (data.item_is_purchased) {
                this.state.items.forEach((item)=>{
                    if (item.item_id != data.item_id) {
                        items.push(item);
                    }
                });
            }
            $(document).trigger('update_items_db', {items});
        }, (_error)=>{
            console.error(_error);
        });
    }
    onAddToList(item){
        let items = this.state.items;
        items.unshift(item);
        this.setState({items});
        $(document).trigger('update_items_db', {items});
    }
    onUpdateList(items) {
        this.setState({items});
        $(document).trigger('update_items_db', {items});
    }
    fetchItems() {
        $.ajax(endpoints.main, {
            method: 'POST',
            data: {
                account_id: this.state.user_data.user_id,
                action: 'get_items',
            },
        }).then((response) => {
            try {
                let items = JSON.parse(response);
                this.setState({items});
                $(document).trigger('update_items_db', {items});
            } catch (e) {
                console.error(e, response);
            }
        });
    }
    render(){
        return (
            <Router>
                <div className="application-container" data-menu-open={this.state.mobileMenuOpen}>
                    <Header
                        onShowSignOut={this.onShowSignOut}
                        onShowSignIn={this.onShowSignIn}
                        toggleMobileMenu={this.toggleMobileMenu}
                        mobileMenuOpen={this.mobileMenuOpen}
                        username={this.state.user_data && this.state.user_data.user_name || null}
                    />

                    <Switch>
                        <Route path="/login">
                            <div id="login-modal">
                                <LoginForm 
                                onLogin={this.onLogin}/>
                            </div>
                        </Route>
                        <Route path="/reports">
                            <Reports 
                                user={this.state.user_data}
                            />
                        </Route>
                        <Route path="/history">
                            <ShoppingHistory user={this.state.user_data}/>
                        </Route>
                        <Route path="/">
                            <div className="weneed-app">
                                <div className="shopping-list-wrapper">
                                    <div id="shopping-list-actions">
                                        <Actions 
                                        user={this.state.user_data}
                                        onAddToList={this.onAddToList}/>
                                    </div>

                                    {(this.state.user_data) ? (
                                        <div id="shopping-list-container">
                                            <ShoppingList
                                            items={this.state.items}
                                            updateItem={this.updateItem}/>
                                        </div>
                                    ) : ('')
                                    }
                                </div>
                            </div>
                        </Route>
                    </Switch>
                </div>   
            </Router>
        );
    }
    componentDidMount(){
        if (this.state.user_data) {
            this.fetchItems();
        }
    }
}
ReactDOM.render(<App />, document.getElementById('app'));
