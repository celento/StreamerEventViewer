import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withHistory, withRouter } from 'react-router-dom';


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: null,
            fav_streamer: null,
        };

        this.setFavourite = this.setFavourite.bind(this);
        this.editStream = this.editStream.bind(this);
        this.watchStream = this.watchStream.bind(this);
    }


    componentWillMount() {

        Meteor.call('getUser', Session.get('user'), (err, res) => {
            if (!err) {
                this.setState({
                    userInfo: res,
                })
                if (res.fav_streamer != undefined || res.fav_streamer != null) {
                    this.setState({
                        fav_streamer: res.fav_streamer,
                    })
                }
            }

        })
    }

    componentDidUpdate(prevProps, prevState) {

    }



    setFavourite() {
        var username = document.getElementById('fav-streamer').value;
        Meteor.call('setFavStreamer', Session.get('user'), username, (err, res) => {
            if (!err) {
                this.setState({
                    fav_streamer: res
                })

            } else {
                alert("Something went wrong! Try again")
            }
        })
    }

    editStream() {

        this.setState({
            fav_streamer: null
        })
    }

    watchStream() {
        this.props.history.push('/dashboard/stream')
    }

    render() {


        document.title = "Home | StreamerEventViewer";


        if (this.state.userInfo == null) {
            return (<div className="center-container"><p className="loading">Loading...</p></div>)
        }

        // Rendering Favourite Streamer
        var fav_render = null;
        if (this.state.fav_streamer == null || this.state.fav_streamer == undefined) {
            fav_render = <div> <p className="hp-legend">Set your Favourite Streamer</p>
                <div className="button-holder">
                    <input placeholder="username" className="fav-streamer-input" id="fav-streamer" />
                    <button onClick={() => this.setFavourite()} className="update-streamer">Update</button>
                </div></div>
        } else {
            fav_render = <div>
                <p>Your Favourite Streamer</p>
                <div className="fav-streamer-holder-v">
                    <img className="s-dp" src={this.state.fav_streamer.profile_image_url} />
                    <h1>{this.state.fav_streamer.display_name}</h1>
                </div>
                <button onClick={() => { this.watchStream() }} className="btn-watch">
                    Watch Stream
                </button>
                <p onClick={() => this.editStream()} className="s-edit">Edit</p>
            </div>
        }


        return (
            <div className="center-container">
                <center>
                    <h1 className="welcome-txt">Hi, {this.state.userInfo.display_name}</h1>
                    {fav_render}
                </center>
            </div>
        );
    }
}

export default withRouter(Home);