import React, { useEffect, useRef } from 'react';
import Compiler from './components/Compiler';
import Board from './components/Board';
import { useSubscription } from '@apollo/client';
import gql from 'graphql-tag';
import { Room, Constants, Moves, User } from './utils/constant';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Game = () => {
  const location: any = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const roomId: string = location.state.roomId;
  const userName: string = location.state.userName;
  const userId: string = location.state.userId;
  const isLeader: boolean = location.state.isLeader;

  useEffect(() => {
    
  });

  window.onbeforeunload = () => {
    return "WARNING! You will lose if you reload!";
  };


  return (
    <div className="flex h-screen w-full game">
      <Board setUsers={(users:User[])=>setUsers(users)}/>
      <Compiler users={users}/>
    </div>
  );
}
export default Game;