class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '', 
            password: '',
            hasUserInfo: false
        };

        this.handleSignOut = this.handleSignOut.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);

        this.getUserData();        
        $(document).on('login_successful', ()=>{
            console.log('login success, getting user data');
            this.getUserData();
        });
    }
    getUserData(){
        console.log('get user data');
        let data = getCookie('weneed_user');
        if (data != ''){ 
            data = JSON.parse(data)[0];
            
            if (data.user_name) {
                this.state.username = data.user_name;
                if (data.user_id) {
                    this.state.user_id = data.user_id;
                }
                this.state.hasUserInfo = true;
            } else {
                this.state.username = '';
                this.state.hasUserInfo = false;
            }
        } else {
            this.state.username = '';
            this.state.hasUserInfo = false;
        }
    }
    handleSignOut(){
        console.log('sign out triggered');
        setCookie('weneed_user', '[{}]', 365);
        this.state.hasUserInfo = false;
        this.state.username = '';
    }
    handleSignIn(){
        $(document).trigger('sign_in_triggered');
        // open a modal for sign in / create account
        // ReactDOM.render(<LoginForm />, document.getElementById('login-modal'));
    }
    render(){
        if (this.state.hasUserInfo) {
            return (
                <div class="user-info">
                    <div class="user-name">{this.state.username}</div>
                    <div class="sign-out" onClick={this.handleSignOut}>Sign Out</div>
                </div>
            );
        } else {
            return (
                <div class="user-info">
                    <div class="sign-in" onClick={this.handleSignIn}>Sign In</div>
                </div>
            );
        }
        
    }
}

ReactDOM.render(<Header />, document.getElementById('header-actions'));