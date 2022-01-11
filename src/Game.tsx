import React, { useRef } from 'react';
import Compiler from './components/Compiler';
import Board from './components/Board';
import { useSubscription } from '@apollo/client';
import gql from 'graphql-tag';
import { Room, Constants, Moves } from './utils/constant';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Game = () => {
  const location: any = useLocation();
  const roomId: string = location.state.roomId;
  const userName: string = location.state.userName;
  const userId: string = location.state.userId;
  const isLeader: boolean = location.state.isLeader;

  return (
    <div className="flex h-screen w-full game">
      <Board />
      <Compiler/>
    </div>
  );
}
export default Game;