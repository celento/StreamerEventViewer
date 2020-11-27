
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainContainer from '../../ui/containers/MainContainer';
import Login from '../../ui/containers/pages/Login';
import TwitchAuth from '../../ui/containers/pages/TwitchAuth';
import Home from '../../ui/containers/pages/Home';
import Stream from '../../ui/containers/pages/Stream';
import StreamParent from '../../ui/containers/pages/StreamParent';


export const renderRoutes = () => (
  <Router >
    <div>
      <Switch>

        <Route exact path="/" component={Login} />
        <Route exact path="/oauth/twitch" component={TwitchAuth} />



        <Route path="/dashboard/">
          <MainContainer>
            <Route exact path="/dashboard/home" component={Home} />
            <Route exact path="/dashboard/stream" component={StreamParent} />
          </MainContainer>
        </Route>





      </Switch>
    </div>

  </Router>
);
