 
import { func } from "prop-types";
import { testDB } from "../imports/collections/testDB";
import { userInfo } from "../imports/collections/userInfo";
import { Events } from "../imports/collections/Events";
 
 



Meteor.methods({

    

    getUserInfo(accessToken){
 
          var auth =  "Bearer " + accessToken;
        
        //   GET headers

          var postData = {
                headers : {
                    'client-id' : 'bddx6kcbevv3mmsdifeqrsprsk4rgs',
                    Authorization: auth
                }
          }

        //   Get info of the User

          return new Promise(function(resolve,reject){
            HTTP.call( 'GET', 'https://api.twitch.tv/helix/users', postData,
               function( error, response ) {
            
               if ( error ) {
                
                console.log(error)
               } else {

                var userData = response.data.data[0];
                var userID =  userData.id;
                var timestamp = Date.now();

                // Check if user exist
               var userExist = Meteor.call('userExist',userID);

               if(userExist){
                //Update the session time (+7 days)
                Meteor.call('updateSession',userID);
                var sessionID = Meteor.call('getSessionID',userID);
                resolve(sessionID);

               }else{

                // Generate SessionID 
                var sessionID = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 24; i++)
                sessionID += possible.charAt(Math.floor(Math.random() * possible.length));

                // Add the user to the DB
                userInfo.insert({
                    _id:userID,
                    sessionID,
                    username:userData.login,
                    display_name:userData.display_name,
                    profile_img : userData.profile_image_url,
                    timestamp,
                    fav_streamer:null,
                    accessToken : accessToken,
                    tokenExpiry: timestamp + 604800000,
                })
 
                // set a cookie
                // start a session on client
           
                resolve(sessionID)
               }
            }

               });
            })
    },


    
    userExist(userID){

        // Checking if the user exists
        var data = userInfo.findOne({_id:userID});
        if(data!=undefined || data!=null){
            return true;
        }
        return false;

    },

    getSessionID(userID){
        var data = userInfo.findOne({_id:userID});
        return data.sessionID;
    },

    getUser(sessionID){
        var data = userInfo.findOne({sessionID});
        return data;
    },



    updateSession(userID){
        userInfo.update({
            _id:userID
        },
        {$set:{
            tokenExpiry:Date.now()+604800000,
        }})
    },  


    // Fetch Favourite Streamer
    setFavStreamer(sessionID,username){
        var accessToken = userInfo.findOne({sessionID}).accessToken;
        var auth =  "Bearer " + accessToken;


        var postData = {
            headers : {
                'client-id' : 'bddx6kcbevv3mmsdifeqrsprsk4rgs',
                Authorization: auth
            }
      }

     
    //   Get info of the streamer
      return new Promise(function(resolve,reject){
        HTTP.call( 'GET', 'https://api.twitch.tv/helix/users?login='+username, postData,
           function( error, response ) {
    
           
             var data = JSON.parse(response.content);
           
        userInfo.update({
            sessionID
        },
        {$set:{
            fav_streamer:
                 data.data[0],
        }})

        Meteor.call('startWebHook',sessionID);
     
        resolve(data.data[0])
           })

          
        })


    },  

    logEvent(streamer_name, event_type, viewer_name, created_at){
        Events.insert({
            streamer_name, event_type, viewer_name, created_at
        })
    },

    getFavStreamerName(sessionID){
        var data = userInfo.findOne({sessionID}).fav_streamer;
        return data;
    },


    startWebHook(sessionID){

        // Configuring the Webhook
        var sourceURL = "http://34.230.90.77:3000";
        var accessToken = userInfo.findOne({sessionID}).accessToken;
        var auth =  "Bearer " + accessToken;

        // Getting the fav_streamer 
        var fav_streamer = userInfo.findOne({sessionID}).fav_streamer.id; 

        var postDataFollow = {
            headers : {
                'client-id' : 'bddx6kcbevv3mmsdifeqrsprsk4rgs',
                Authorization: auth
            },

            data: {
                "hub.callback":sourceURL+"/webhook/twitch/follow",
                "hub.mode":"subscribe",
                "hub.topic":"https://api.twitch.tv/helix/users/follows?first=1&to_id="+fav_streamer,
                "hub.lease_seconds":400,
              },
      }


      var postDataSubs= {
        headers : {
            'client-id' : 'bddx6kcbevv3mmsdifeqrsprsk4rgs',
            Authorization: auth
        },

        data: {
            "hub.callback":sourceURL+"/webhook/twitch/subs",
            "hub.mode":"subscribe",
            "hub.topic":"https://api.twitch.tv/helix/subscriptions/events?first=1&broadcaster_id="+fav_streamer,
            "hub.lease_seconds":400,
          },
  }

 
     
    //   Get info of the streamer
      return new Promise(function(resolve,reject){
        HTTP.call( 'POST', 'https://api.twitch.tv/helix/webhooks/hub', postDataFollow,
           function( error, response ) {
            
        })

        HTTP.call( 'POST', 'https://api.twitch.tv/helix/webhooks/hub', postDataSubs,
        function( error, response ) {
 

         resolve();
     })


    })
}
  



  

 
 

})

