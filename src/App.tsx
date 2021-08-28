import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Compiler from './components/Compiler';
import { Game } from './components/Game';
import Home from './Home';

export default function App(props: any) {
  return (
    <Router>
      <Switch>
      <Route path='/game'>
        <div className="flex">
          <Compiler />
          <Game />
        </div>
      </Route>
      <Route path='/'>
        <Home/>
      </Route>
    </Switch>
    </Router>
  );
}
