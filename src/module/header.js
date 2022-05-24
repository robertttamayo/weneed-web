import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { withRouter } from "react-router";

class Main extends React.Component {
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
        this.props.toggleMobileMenu();
    }
    render(){
        return (
            <div id="header">
                <div className="title-section">
                    <div className="title">We Need</div>
                    <div className="subtitle">A Shared Shopping List App</div>
                </div>
                <div id="header-actions">
                {
                    (this.props.username) ? (
                        <div className="menu-wrap-wrap">
                            <div className="mobile-menu-trigger" onClick={this.toggleMobileMenu}><i className="fas fa-bars"></i></div>
                            <div className="menu-wrap">
                                <div className="user-info">
                                    <div className="user-name">{this.props.username}</div>
                                    <div className="view-reports">
                                        <Link to="/reports">Reports</Link>
                                        </div>
                                    <div className="history">
                                        <Link to="/history">History</Link>
                                    </div>
                                    <div className="sign-out" onClick={this.handleSignOut}>
                                        <Link to="/login">Sign Out</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : ( 
                        <div className="user-info">
                            <div className="sign-in">
                                <Link to="/login">Sign In</Link></div>
                        </div>
                    )
                }
                </div>
            </div>
        );
    }
}
export const Header = withRouter(Main);