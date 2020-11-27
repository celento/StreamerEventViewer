import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withHistory, withRouter } from 'react-router-dom';
import { Events } from '../../../collections/Events';
import { createContainer } from 'meteor/react-meteor-data';

const EMBED_URL = 'https://embed.twitch.tv/embed/v1.js';
var stream_loaded = false;
class Stream extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: null,
            fav_streamer: null,
        };

        this.setFavourite = this.setFavourite.bind(this);
        this.editStream = this.editStream.bind(this);
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

    componentDidMount() {

        Meteor.call('getFavStreamerName', Session.get('user'), (err, res) => {
            this.setState({
                fav_streamer: res,
            })
        })

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

    startWebHook() {
        Meteor.call('startWebHook', Session.get('user'), (err) => {
            if (!err) {
                console.log("DONEEE")
            }
        })
    }

    render() {


        if (!this.props.events || this.props.fav_streamer == null) {
            return (<div className="center-container"><p className="loading">Loading...</p></div>)
        }



        if (!stream_loaded) {
            console.log(document.getElementById('twitch-embed'))
            let embed;
            const script = document.createElement('script');
            script.setAttribute(
                'src',
                EMBED_URL
            );
            script.addEventListener('load', () => {
                embed = new window.Twitch.Embed("twitch-embed", {
                    targetID: 'twitch-embed',
                    width: '100%',

                    height: '100%',
                    channel: this.props.fav_streamer_id,
                    layout: "video-with-chat",
                });
            });
            document.body.appendChild(script);
            stream_loaded = true;


        }

        document.title = "Stream | StreamerEventViewer";
        console.log(Session.get('user'))
        console.log(this.props.events)




        // Rendering Favourite Streamer



        return (
            <div className="full-container">
                <div id="twitch-embed" className="full-container-left">

                </div>
                <div className="full-container-right">


                    <p className="rec-events">Recent Events</p>
                    <p className="uin32">Updated in realtime</p>

                    {this.props.events.map(event =>
                        <div className="event-holder">
                            <p className="event-type"> New {event.event_type}</p>
                            <p className="event-user"> {event.viewer_name}</p>

                            <p className="event-time">{event.created_at}</p>
                        </div>

                    )}


                </div>
            </div>
        );


    }


}
export default createContainer((props) => {
    console.log(props.fav_streamer)
    Meteor.subscribe('events', props.fav_streamer);

    return {
        events: Events.find({}, { sort: { timestamp: - 1 } }).fetch(),
    };
}, Stream);