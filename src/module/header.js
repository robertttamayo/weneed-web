import {getCookie, setCookie} from "./cookies";

export class Header extends React.Component {
    constructor(props) {
        super(props);

        this.handleSignOut = this.handleSignOut.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    }
    handleSignIn(){
        this.props.onShowSignIn();
    }
    handleSignOut(){
        this.props.onShowSignOut();
    }
    toggleMobileMenu() {
        $('body').toggleClass('mobile-menu-open');
    }
    render(){
        if (this.props.username) {
            return (
                <div className="menu-wrap-wrap">
                    <div className="mobile-menu-trigger" onClick={this.toggleMobileMenu}><i className="fas fa-bars"></i></div>
                    <div className="menu-wrap">
                        <div className="user-info">
                            <div className="user-name">{this.props.username}</div>
                            <div className="sign-out" onClick={this.handleSignOut}>Sign Out</div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="user-info">
                    <div className="sign-in" onClick={this.handleSignIn}>Sign In</div>
                </div>
            );
        }
        
    }
}

// ReactDOM.render(<Header />, document.getElementById('header-actions'));