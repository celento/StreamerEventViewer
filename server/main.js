import { Meteor } from 'meteor/meteor';
import React from 'react';
 
 
import { onPageLoad } from 'meteor/server-render';  
import  {renderRoutes}  from '../imports/startup/both/routes.jsx'
 
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import {Helmet} from 'react-helmet';
 
 
import bodyParser from 'body-parser';
import { func } from 'prop-types';
import { Events } from '../imports/collections/Events.js';

 
Meteor.startup(() => {

 onPageLoad(sink => {  
  const context = {};
  const app = ReactDOMServer.renderToString(
    <StaticRouter location={sink.request.url} context={context}>
     {renderRoutes()}
    </StaticRouter>

 );
 
  sink.renderIntoElementById("target", app);
  const helmet = Helmet.renderStatic();
  sink.appendToHead(helmet.meta.toString());
  sink.appendToHead(helmet.title.toString());
  });

  Meteor.publish("events", function(username) {
    return Events.find({ streamer_name: username },{sort:{timestamp:-1},limit:10});
  });


// Inserting Events to DB
  function insertEventFollow(response){
    Events.insert({streamer_name:response.to_name,event_type:"follow",viewer_name:response.from_name,created_at:response.followed_at,timestamp:Date.now()});
  }

  function insertEventSub(response){
    Events.insert({streamer_name:response.event_data.broadcaster_name,event_type:"subscription",viewer_name:response.event_data.gifter_name,created_at:response.event_timestamp,timestamp:Date.now()});
  }
 

  // Webhooks for Twitch Events
  WebApp.connectHandlers.use('/webhook/twitch/follow', bodyParser.json());  

  WebApp.connectHandlers.use('/webhook/twitch/subs', bodyParser.json());

  WebApp.connectHandlers.use(Meteor.bindEnvironment(function(req, res, next) {
    var challenge = null;
    if(req.url.startsWith("/webhook/twitch")){
      var challenge = req.query['hub.challenge']
    
  
    if (req.url.startsWith("/webhook/twitch/follow")) {
     
      if(Object.keys(req.body).length){
        var response = req.body.data[0]
        console.log(response)
    
        Meteor.setTimeout(insertEventFollow(response),2000)
     
      }
    }

    if (req.url.startsWith("/webhook/twitch/subs")) {
     
      if(Object.keys(req.body).length){
        var response = req.body.data[0]
        console.log(response)
    
        Meteor.setTimeout(insertEventSub(response),2000)
      }
    }

    // Challenge 
    if(challenge!=undefined || challenge!=null){
      res.writeHead(200, { 'Content-Type': 'text/plain'});
      res.end(req.query['hub.challenge']);
    } 

}else{
    next();
  }
  
  }));

});
