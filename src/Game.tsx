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
  const [roomData, setRoomData] = useState<Room>();
  const [moves, setMoves] = useState<Moves>({id: roomId + "__" + Constants.makingMoves,moves: []});
  const [completedMoves, setCompletedMoves] = useState<Moves>({ id: roomId + "__" + Constants.completedMoves, moves: [] });

  const roomSubscription = () => {
    const ROOM_SUBSCRIPTION = gql`
      subscription MySubscription {
        getroom(id: "${roomId}") {
          inbox {
            message
            type
          }
          users {
            color
            id
            name
            occupiedTiles {
              i
              j
            }
            position {
              i
              j
            }
            power
          }
        } 
      }
    `;
    const { data, loading } = useSubscription(ROOM_SUBSCRIPTION,{ variables: { id: roomId } });
    const room: Room = data?.getroom;
    setRoomData(room);
  }
  const movesSubscription = () => {
    const MOVES_SUBSCRIPTION = gql`
      subscription MySubscription {
        getmakingMoves(id: "${roomId+"__"+Constants.makingMoves}") {
          moves {
            parameters {
              from {
                i
                j
              }
              to {
                i
                j
              }
              userId
              value
            }
            type
            id
          }
        }
      }    
    `;
    const { data, loading } = useSubscription(MOVES_SUBSCRIPTION,{ variables: { id: roomId } });
    const makingMoves: Moves = data?.getmakingMoves;
    if(makingMoves) setMoves(makingMoves);
  }
  const completedMovesSubscription = () => {
    const COMPLETED_MOVES_SUBSCRIPTION = gql`
      subscription MySubscription {
        getcompletedMoves(id: "${roomId+"__"+Constants.completedMoves}") {
          moves {
            parameters {
              from {
                i
                j
              }
              to {
                i
                j
              }
              userId
              value
            }
            type
            id
          }
        }
      }    
    `;
    const { data, loading } = useSubscription(COMPLETED_MOVES_SUBSCRIPTION,{ variables: { id: roomId } });
    const completedMovesData: Moves = data?.getcompletedMoves;
    if(completedMoves) setCompletedMoves(completedMovesData);
  }

  return (
    <div className="flex h-screen w-full game">
      <Compiler completedMoves={completedMoves} roomData={roomData} moves={moves}/>
      <Board completedMoves={completedMoves} roomData={roomData} moves={moves}/>
    </div>
  );
};

export default Game;