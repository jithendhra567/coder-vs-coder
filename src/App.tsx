import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Compiler from './components/Compiler';
import Board from './components/Board';
import Game from './Game';
import Home from './Home';

export default function App(props: any) {

  return (
    <Router>
      <Switch>
      <Route path='/game'>
          <Game/>
      </Route>
      <Route path='/'>
          <Home/>
      </Route>
    </Switch>
    </Router>
  );
}
