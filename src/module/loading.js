import React, { PureComponent } from "react";

export class Loading extends PureComponent {
    render() {
        return (
            <div className="loading-container">
                <div className="loading-title">{this.props.title}</div>
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        );
    }
}