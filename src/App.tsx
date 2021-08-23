import React from 'react';
import Compiler from './components/Compiler';
import { Game } from './components/Game';

export default function App(props: any) {
  return (
    <div className="flex">
      <Compiler />
      <Game/>
    </div>
  );
}
