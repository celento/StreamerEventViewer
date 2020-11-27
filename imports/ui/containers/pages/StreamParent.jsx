import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withHistory, withRouter } from 'react-router-dom';
import { Events } from '../../../collections/Events';
import { createContainer } from 'meteor/react-meteor-data';
import Stream from './Stream';

class StreamParent extends Component {
    constructor(props) {
        super(props);
        this.state = {

            fav_streamer: null,
        };


    }



    componentDidMount() {
        Meteor.call('getFavStreamerName', Session.get('user'), (err, res) => {
            this.setState({
                fav_streamer: res
            })
        })
    }


    render() {


        if (this.state.fav_streamer == null) {
            return (<div className="center-container"><p className="loading">Loading...</p></div>)
        }

        return (
            <div>
                <Stream fav_streamer={this.state.fav_streamer.display_name} fav_streamer_id={this.state.fav_streamer.login} />
            </div>
        )

    }


}
export default StreamParent;