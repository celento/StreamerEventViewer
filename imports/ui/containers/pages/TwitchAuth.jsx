import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withHistory, withRouter } from 'react-router-dom';

var curr_View;
class TwitchAuth extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }


    componentWillMount() {

    }

    componentDidMount() {

        // Session Cookie
        // Set to expire in 7 days
        function setCookie(cookieName, cookieValue, expiry) {
            var d = new Date();
            d.setTime(d.getTime() + (expiry * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
        }


        var locationHash = window.location.hash;
        var accessToken = locationHash.substring(
            locationHash.indexOf("=") + 1,
            locationHash.indexOf("&")
        );

        // Fetching userInfo after authentication
        Meteor.call('getUserInfo', accessToken, (err, res) => {
            if (!err) {
                console.log("done");
                var sessionID = res;
                console.log(sessionID)
                setCookie("session", sessionID, 7);
                window.location = "/dashboard/home";

            }
        })
    }

    componentDidUpdate() {

    }


    render() {

        return (
            <div className="login-container">
                <p>Please wait...</p>
            </div>
        );
    }
}

export default withRouter(TwitchAuth);