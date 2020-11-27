import { Meteor } from 'meteor/meteor';
  
ServiceConfiguration.configurations.remove({
  service: "twitch"
});
ServiceConfiguration.configurations.insert({
  service: "twitch",
  scope:[],
 
 
  clientId: "bddx6kcbevv3mmsdifeqrsprsk4rgs",
  redirectUri: 'http://localhost:8000/oauth/twitch',
  secret: "upv7tpmlacw4ckerikqncrvgyvi12n"
});


// ServiceConfiguration.configurations.remove({
//   service: 'MeteorOAuth2Server'
// });

// ServiceConfiguration.configurations.insert({
//   service: 'MeteorOAuth2Server',
//   clientId: '{ your client id, provided by resource owner }',
//   scope: [], // whatever scope the resource owner supports. By default, ['email'] will be used.
//   secret: '{ your app\'s secret, provided by resource owner }',
//   baseUrl: '{ the base url of the resource owner\'s site. }',
//   loginUrl: '{ the login url of the resource owner\'s site. }'
// });  