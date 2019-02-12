class Toolbar extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        return (
            <div className="toolbar-wrap-wrap">
                <div class="mobile-menu-icon"><i class="fas fa-bars"></i></div>

                <div className="toolbar-wrap">
                    <div className="wn-button button-add-user">Invite to group</div>
                    
                    <div className="wn-button button-add-item">Add new item</div>
                </div>
            </div>
        );
    }

}
