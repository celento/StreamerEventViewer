import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withHistory, withRouter } from 'react-router-dom';

var curr_View;
class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);

        this.state = {


        };
    }


    componentWillMount() {
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }

        var sessionID = getCookie("session");
        Session.set('user', sessionID);
        if (sessionID == undefined) {
            this.props.history.push('/');
        }
    }

    logout(e) {

        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location = "/";

    }



    render() {


        return (
            <div className="main-container">
                <header>
                    <div className="header-hold">
                        <div className="h-holder-left">
                            <p className="logo-text">StreamerEventViewer</p>
                        </div>

                        <div id="menu_user" className="menu_user">
                            <button onClick={this.logout} className="signout-button" >Sign Out</button>
                        </div>
                    </div>
                </header>

                <div className="child-hold">
                    {this.props.children}
                </div>

            </div>
        );
    }
}

export default withRouter(MainContainer);