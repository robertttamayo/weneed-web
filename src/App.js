import React from "react";
import ReactDOM from "react-dom";
import {ShoppingList} from "./module/shopping-list";
import {LoginForm} from "./module/login-form";
import {Actions} from "./module/actions";
import {Header} from "./module/header";
import {endpoints} from "./module/endpoints";
import {getCookie, setCookie} from "./module/cookies";

class App extends React.Component {
    constructor(props){
        super(props);

        this.fetchItems = this.fetchItems.bind(this);
        this.onShowSignOut = this.onShowSignOut.bind(this);
        this.onShowSignIn = this.onShowSignIn.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onUpdateList = this.onUpdateList.bind(this);
        this.onAddToList = this.onAddToList.bind(this);
    
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
        }
    }
    onLogin() {
        console.log('on login called');
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
    onAddToList(item){
        let items = this.state.items;
        items.unshift(item);
        this.setState({items});
    }
    onUpdateList(items) {
        this.setState({items});
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
            } catch (e) {
                console.error(e);
                console.log(response);
            }
        });
    }
    render(){
        return (
            <React.Fragment>
                {ReactDOM.createPortal(
                    <Header
                    onShowSignOut={this.onShowSignOut}
                    onShowSignIn={this.onShowSignIn}
                    />, document.getElementById('header-actions'))}
                <div className="weneed-app">
                    {(this.state.user_data) ? ('') : (
                    <div id="login-modal">
                        <LoginForm 
                        onLogin={this.onLogin}/>
                    </div>
                    )}

                    <div className="shopping-list-wrapper">
                        <div id="shopping-list-actions">
                            <Actions 
                            user={this.state.user_data}
                            onAddToList={this.onAddToList}/>
                        </div>

                        {(this.state.user_data) ? (
                        <div id="shopping-list-container">
                            
                            <ShoppingList
                            items={this.state.items}/>
                        </div>
                        ) : ('')
                        }
                    </div>
                </div>
            </React.Fragment>   
        );
    }
    componentDidMount(){
        if (this.state.user_data) {
            this.fetchItems();
        }
    }
}
ReactDOM.render(<App />, document.getElementById('app'));

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function() {
//         navigator.serviceWorker.register('/sw.js').then(function(registration) {
//         // Registration was successful
//         console.log(registration);
//         console.log('ServiceWorker registration successful with scope: ', registration.scope);
//         }, function(err) {
//         // registration failed :(
//         console.log('ServiceWorker registration failed: ', err);
//         });
//     });
// } else {
//     console.log('something happened');
// }
// if (!"Notification" in window) {
//     console.log("This browser does not support notifications.");
// } else {
//     console.log("notification supported");
//     Notification.requestPermission().then(function(result) {
//         console.log(result);
//         window.setTimeout(()=>{
//             var notification = new Notification("Hi there!");
//         }, 5000);
//     });
// }
