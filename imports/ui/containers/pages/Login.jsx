import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withHistory, withRouter } from 'react-router-dom';

var curr_View;
class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }


    componentWillMount() {

    }

    componentDidUpdate(prevProps, prevState) {

    }



    render() {

        return (

            <div className="center-container">
                <center>
                    <img className="login-img" src="/img/login.png" />
                    <h1 className="welcome-txt1">Welcome to StreamerEventViewer</h1>
                    <a href="https://id.twitch.tv/oauth2/authorize?client_id=bddx6kcbevv3mmsdifeqrsprsk4rgs&redirect_uri=http://34.230.90.77:3000/oauth/twitch&response_type=token&scope=user:edit+user:read:email">

                        <button className="login-button" onClick={this.login}>Login with Twitch</button>
                    </a>
                </center>
            </div>
        );
    }
}

export default withRouter(Login);