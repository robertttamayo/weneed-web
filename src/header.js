class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '', 
            password: '',
            user_id: '',
            hasUserInfo: false
        };

        this.handleSignOut = this.handleSignOut.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.toggleMobileMenu = this.toggleMobileMenu.bind(this);

        this.getUserData();        
        $(document).on('login_successful', ()=>{
            this.getUserData();
        });
    }
    getUserData(){
        let data = getCookie('weneed_user');
        if (data != ''){ 
            data = JSON.parse(data)[0];
            
            if (data.user_name) {
                this.state.username = data.user_name;
                this.state.hasUserInfo = true;
                this.state.user_id = 23;
                this.setState(this.state);
            } else {
                this.setState({hasUserInfo:false, username: ''});
            }
        } else {
            this.setState({hasUserInfo:false, username: ''});
        }
    }
    handleSignOut(){
        setCookie('weneed_user', '[{}]', 365);
        this.setState({hasUserInfo:false, username: ''});
    }
    handleSignIn(){
        $(document).trigger('sign_in_triggered');
    }
    toggleMobileMenu() {
        $('body').toggleClass('mobile-menu-open');
    }
    render(){
        if (this.state.hasUserInfo) {
            return (
                <div class="menu-wrap-wrap">
                    <div class="mobile-menu-trigger" onClick={this.toggleMobileMenu}><i class="fas fa-bars"></i></div>
                    <div class="menu-wrap">
                        <div class="user-info">
                            <div class="user-name">{this.state.username}</div>
                            <div class="sign-out" onClick={this.handleSignOut}>Sign Out</div>
                        </div>
                    </div>
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