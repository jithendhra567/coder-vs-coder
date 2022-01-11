// @flow 
import { useSubscription } from '@apollo/client';
import gql from 'graphql-tag';
import { title } from 'process';
import * as React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { color1, color2, debounce, Move, Moves, position, Room, Tile, TileRow, User } from '../utils/constant';
import '../index.css';
import { useLocation } from "react-router-dom";
import { Constants } from '../utils/constant';
import { linkWithCompletedMoves, deleteMove, fetchGraphQL } from '../utils/mutations';

const Board = () => {
  const location: any = useLocation();
  const roomId: string = location.state.roomId;
  const userName: string = location.state.userName;
  const userId: string = location.state.userId;
  const isLeader: boolean = location.state.isLeader;
  const tempRow: Tile[][] = [];
  const gridSize = 25;
  for (let i = 0; i < gridSize; i++){
    const tempCol: Tile[] = [];
    for (let j = 0; j < gridSize; j++)
      tempCol.push({info: i+','+j, id: roomId+"__"+i+','+j});
    tempRow.push(tempCol);
  }

  const [boardData, setBoardData] = useState<Tile[][]>(tempRow);
  const roomData = useRef<Room>();
  const [users, setUsers] = useState<User[]>([]);
  const moves = useRef<Moves>({id: roomId + "__" + Constants.makingMoves,moves: []});
  const completedMoves = useRef<Moves>({ id: roomId + "__" + Constants.completedMoves, moves: [] });
  const movesMap = useRef<Map<string, Move>>(new Map()).current;

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
    roomData.current = room;
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
    if(makingMoves) moves.current = makingMoves;
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
    completedMoves.current = completedMovesData;
  }

  // init
  roomSubscription();
  movesSubscription();
  completedMovesSubscription();

  //updating room data  
  useEffect(()=> setUsers(roomData.current?roomData.current.users:[]) , [roomData.current]);

  //updating moves data
  const updateMovesData = () => {
    if (moves.current?.moves && moves.current.moves.length > 0) {
      moves.current.moves.forEach(move => {
        if (!movesMap.has(move.id)) {
          movesMap.set(move.id, move);
          switch (move.type) {
            case 'jump': {
              const params = move.parameters;
              if (!params?.userId) return;
              const user = getUserFromId(params.userId);
              if (params.to) jump([params.to.i, params.to.j], user);
              user.power = user.power - 0.5;
              if (params.to) user.position = { i: params.to.i, j: params.to.j };
            }
              break;
            case 'move': {
              const params = move.parameters;
              if (!params?.userId || !params.to ) return;
              const user = getUserFromId(params.userId);
              moveTo([params.to.i, params.to.j], user).then(() => {
                const temp = movesMap.get(move.id);
                if (!temp || !params.to) return;
                temp.returnValue = { i: params.to.i, j: params.to.j };
                if (isLeader)
                  fetchGraphQL(linkWithCompletedMoves(move.id, temp?.returnValue, roomId), "MyMutation", {})
                  .then(() => console.log('moved'));
              });
            }
              break;
            case 'attack': {
              const params = move.parameters;
              if (!params?.userId || !params.to ) return;
              const user = getUserFromId(params.userId);
              const userPosition = user.position;
              attack([params.to.i, params.to.j], user, move.id).then(() => {
                const temp = movesMap.get(move.id);
                if (!temp || !params.to || !temp.parameters) return;
                temp.parameters.from = { i: userPosition.i, j: userPosition.j };
                temp.returnValue = { i: params.to.i, j: params.to.j };
                if (isLeader)
                  fetchGraphQL(linkWithCompletedMoves(move.id, temp?.returnValue, roomId), "MyMutation", {})
                  .then(() => console.log('attacked'));
              });
            }
          }
        }
      });
    }
  }
  useEffect(updateMovesData, [moves.current]);

  //updating completed moves data
  const updateCompletedMovesData = () => {
    if(completedMoves.current?.moves && completedMoves.current.moves.length > 0){
      completedMoves.current.moves.forEach(move => {
        if (movesMap.has(move.id)) {
          if (!isLeader) {
            if (move.returnValue != movesMap.get(move.id)?.returnValue) {
              //if not synced
              
            }
            fetchGraphQL(deleteMove(move.id), "MyMutation", {});
          }
          setTimeout(() => {
            const moveTemp = movesMap.get(move.id);
            if (!moveTemp) return;
            switch (moveTemp.type) {
              case 'attack':
                if (moveTemp.parameters?.from && moveTemp.parameters?.to) {
                  const from = [moveTemp.parameters?.from.i, moveTemp.parameters?.from.j];
                  const to = [moveTemp.parameters?.to?.i, moveTemp.parameters?.to?.j];
                  attackFrom(from, to, undefined, undefined);
                }
            }
          } , 3000);
        }
      });
    }
  }
  useEffect(updateCompletedMovesData, [completedMoves.current]);

  const getUserFromId = (id: string) => users.filter(user => user.id === id)[0];

  const jump = async (to: number[], user: User) => {
    const tempUsers: User[] = [];
    const tempUser = users.filter(user => user.id === user.id)[0];
    tempUser.position = { i: to[0], j: to[1] };
    tempUser.power = tempUser.power - 1;
    users.forEach(user => {
      if (user.id !== tempUser.id) tempUsers.push(user);
      else tempUsers.push(tempUser);
    });
    setUsers(tempUsers);
    await sleep(250);
  }

  const moveTo = async (to: number[], user: User) => {
    const from = [user.position.i, user.position.j];
    while (!(from[0] == to[0]) || !(from[1] == to[1])) {
      if (from[0] < to[0]) from[0]++;
      else if (from[0] > to[0]) from[0]--;
      if (from[1] < to[1]) from[1]++;
      else if (from[1] > to[1]) from[1]--;
      await jump(from, user);
    }
  }

  const attackFrom = async (from: number[], to: number[], user: User | undefined, moveId: string | undefined) => {
    await occupy(from, user, moveId);
    while (!(from[0] == to[0]) || !(from[1] == to[1])) {
      if (from[0] < to[0]) from[0]++;
      else if (from[0] > to[0]) from[0]--;
      if (from[1] < to[1]) from[1]++;
      else if (from[1] > to[1]) from[1]--;
      await occupy(from, user,moveId);
    }
  }

  const attack = async (to: number[], user: User, moveId: string|undefined) => {
    const from = [user?.position.i, user?.position.j];
    await attackFrom(from, to, user, moveId);
  }

  const occupy = async (position: number[], user: User | undefined, moveId: string|undefined) => {
    const temp = boardData.map(x => x.map(y => y));
    temp[position[0]][position[1]].owner = user?.id;
    temp[position[0]][position[1]].moveId = moveId;
    setBoardData(temp);
    await sleep(200);
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(() => resolve(ms), ms));

  return (
    <div className="flex flex-col justify-center items-center w-2/3 overflow-auto h-screen board">
      <div className="m-5 relative">
        {users.map((user,index) => {
          return (
            <div id={user.id} key={index} className="absolute m-0 w-6 h-6 text-sm text-white flex justify-center items-center rounded-full"
              style={{ backgroundColor: user.color, top: (2.3 + 2.0625 * user.position.i) + 'rem', left: (2.3 + 2.0625 * user.position.j) + 'rem', transition: 'all .2s ease' }}>{user.name.toUpperCase()[0]}</div>
          );
        })}
        <div className="flex ml-8">
          {boardData.map(row => <p className="w-8 h-8 flex items-center text-white justify-center m-0 text-sm" key={row[0].info.split(',')[0]} style={{margin: '.5px'}}>{ row[0].info.split(',')[0] }</p>)}
        </div>
        {
          boardData.map(row =>
          <div className="flex justify-center" key={row[0].info.split(',')[0]}>
            <p className="w-8 h-8 flex items-center text-white justify-center m-0 text-sm" key={row[0].info.split(',')[0]} style={{margin: '.5px'}}>{ row[0].info.split(',')[0] }</p>
              {row.map(col => {
                const style: any = { margin: '.5px', cursor: 'pointer' };
                if (col.owner) {
                  style['backgroundColor'] = getUserFromId(col.owner).color;
                }
                return (<div className="w-8 h-8 tile" style={style} id={col.id} key={row[0].info.split(',')[0] + '' + col.id}>
                  <p className="m-0 text-xs hidden tileText" style={{ color: col.owner ? 'white' : 'black' }}>{col.info}</p>
                </div>);
              })}
          </div>)
        }
      </div>
    </div>
  );
};

export default Board;