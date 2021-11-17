// @flow 
import { useSubscription } from '@apollo/client';
import gql from 'graphql-tag';
import { title } from 'process';
import * as React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { color1, color2, debounce, getUserFromId, Move, Moves, position, Room, Tile, TileRow, User } from '../utils/constant';
import '../index.css';
import { useLocation } from "react-router-dom";
import { Constants } from '../utils/constant';
import { motion } from 'framer-motion';

type BoardProps = {
  roomData: Room;
  moves: Moves;
  completedMoves: Moves;
}

const Board = (props: BoardProps) => {
  const location: any = useLocation();
  const roomId: string = location.state.roomId;
  const userName: string = location.state.userName;
  const userId: string = location.state.userId;
  const isLeader: boolean = location.state.isLeader;
  const tempRow: Tile[][] = [];
  for (let i = 0; i < 19; i++){
    const tempCol: Tile[] = [];
    for (let j = 0; j < 19; j++)
      tempCol.push({info: i+','+j, id: roomId+"__"+i+','+j});
    tempRow.push(tempCol);
  }

  console.log(props.moves);
  const [boardData, setBoardData] = useState<Tile[][]>(tempRow);
  const [users, setUsers] = useState<User[]>([]);
  // const roomData = useRef<Room>(props.roomData);
  // const moves = useRef<Moves>(props.moves);
  // const completedMoves = useRef<Moves>(props.completedMoves);
  const movesMap = useRef<Map<string, Move>>(new Map());

  //updating room data  
  useEffect(()=> setUsers(props.roomData?.users) , [props.roomData]);

  //updating moves data
  const updateMovesData = () => {
    console.log(props.moves.id,'in moves');
    props.moves?.moves.forEach(move => {
      if (!movesMap.current.has(move.id)) {
        movesMap.current.set(move.id, move);
        switch (move.type) {
          case 'jump': {
            const params = move.parameters;
            if (!params?.userId) return;
            const user = getUserFromId(params.userId, users);
            if (params.to) jump([params.to.i, params.to.j], user);
            user.power = user.power - 0.5;
            if (params.to) user.position = { i: params.to.i, j: params.to.j };
          }
            break;
          case 'move': {
            const params = move.parameters;
            if (!params?.userId) return;
            const user = getUserFromId(params.userId, users);
            if (params.to) moveTo([params.to.i, params.to.j], user);
            user.position = { i: params.to?.i ?? 0, j: params.to?.j ?? 0 };
          }
            break;
          case 'attack': {
            const params = move.parameters;
            if (!params?.userId || !params.to || !params.from) return;
            const user = getUserFromId(params.userId, users);
            attack([params.to.i, params.to.j], user, move.id).then(() => {
              const temp = movesMap.current.get(move.id);
              if (!temp || !params.to || !params.from) return;
              temp.returnValue = { i: params.to.i, j: params.to.j };
              if (isLeader) fetchGraphQL(linkWithCompletedMoves(move.id, temp?.returnValue), "MyMutation", {}).then(() => console.log('completed attack'));
            });
          }
        }
      }
    });
  }
  useEffect(updateMovesData, [props.moves]);

  //updating completed moves data
  const updateCompletedMovesData = () => {
    props.completedMoves?.moves.forEach(move => {
      if (movesMap.current.has(move.id)) {
        if (!isLeader) {
          if (move.returnValue != movesMap.current.get(move.id)?.returnValue) {
            //if not synced
            
          }
          fetchGraphQL(deleteMove(move.id), "MyMutation", {});
        }
        setTimeout(() => {
          switch (move.type) {
            case 'attack':
              if (move.parameters?.from && move.parameters?.to) {
                const from = [move.parameters?.from.i, move.parameters?.from.j];
                const to = [move.parameters?.to?.i, move.parameters?.to?.j];
                attackFrom(from, to, undefined, undefined);
              }
          }
        } , 3000);
      }
    });
  }
  useEffect(updateCompletedMovesData, [props.completedMoves]);

  const run = async () => {
    const moveId = new Date().getTime() + "__" + roomId + "__" + userName;
    const move: Move = {
      id: moveId,
      makingMoves: {
        id: roomId + "__" + Constants.makingMoves
      },
      type: "attack",
      parameters: {
        from: {i: 0,j: 0},
        to: {i: 0,j: 18},
        userId: userId,
      },
    };
    await fetchGraphQL(addMove(move), "MyMutation", {});
    
    const moveId2 = new Date().getTime() + "__" + roomId + "__" + userName;
    const move2: Move = {
      id: moveId2,
      makingMoves: {
        id: roomId + "__" + Constants.makingMoves
      },
      type: "attack",
      parameters: {
        from: {i: 0,j: 0},
        to: {i: 18,j: 18},
        userId: userId,
      },
    };
    await fetchGraphQL(addMove(move2), "MyMutation", {});
    
  }

  async function fetchGraphQL(operationsDoc: any, operationName: any, variables: any) {
    const result = await fetch(
      "https://green-wave.ap-south-1.aws.cloud.dgraph.io/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzL3Byb3h5IiwiZHVpZCI6IjB4MjM0ZjAwYyIsImV4cCI6MTYzMDI0Njk2MCwiaXNzIjoicy9hcGkifQ.WIhupejwaJCl4UqGRSNWZxGLIpnsK4qPeSpgW3zQ1bg"
        },
        body: JSON.stringify({
          query: operationsDoc,
          variables: variables,
          operationName: operationName
        })
      }
    );
  
    return await result.json();
  }
  
  const addMove = (move: Move) => `
    mutation MyMutation {
      addmove(input: {id: "${move.id}", type: "${move.type}", makingMoves: {id: "${move.makingMoves.id}"},
        parameters: {from: {i: ${move.parameters?.from?.i}, j: ${move.parameters?.from?.j}}, to: {i: ${move.parameters?.to?.i}, j: ${move.parameters?.to?.j}}, userId: "${move.parameters?.userId}"}}) {
        numUids
      }
    }
  `;

  const deleteMove = (moveId: string) => `
    mutation MyMutation {
      deletemove(filter: {id: {eq: "${moveId}"}}) {
        msg
        numUids
      }
    }
  `;

  const linkWithCompletedMoves = (moveId: string, returnValue: position) => `
    mutation MyMutation {
      updatemove(input: {filter: {id: {eq: "${moveId}"}}, set: {returnValue: {i: ${returnValue.i}, j: ${returnValue.j}} ,completedMoves: {id: "${roomId}__completedMoves"}}}) {
        numUids
      }
    }  
  `;

  const updateUser = (user: User) => `
    mutation MyMutation {
      updateuser(input: {filter: {id: {eq: "${user.id}"}}, set: {position: {i: ${user.position.i}, j: ${user.position.j}}, power: ${user.power}}}) {
        numUids
      }
    }
  `;

  const jump = async (to: number[], user: User) => {
    const userDoc = document.getElementById(user.name);
    const top = 2.3;
    const left = 2.3;
    if (userDoc) {
      userDoc.style.top = (top + 2.0625 * to[0]) + 'rem';
      userDoc.style.left = (left + 2.0625 * to[1]) + 'rem';
    }
    // if (user.name == 'lokesh') user2.position = to.map(a => a);
    // else user1.position = to.map(a => a);
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
    <div className="flex flex-col justify-center items-center bg-gray-900 w-1/2 overflow-auto h-screen board">
      <div className="m-5 relative">
        {users?.map((user,index) => {
          return (
            <div id={user.name} key={index} className="absolute m-0 w-6 h-6 text-sm text-white flex justify-center items-center rounded-full"
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
                const style: any = { margin: '15px', cursor: 'pointer' };
                const animaterStyle: any = {};
                let animaterClass: string = 'animater';
                if (col.owner) {
                  style['backgroundColor'] = getUserFromId(col.owner, users).color;
                  // animaterStyle['width'] = "2rem";
                  // animaterStyle['height'] = "2rem";
                  // animaterClass += ' tileAnimater';
                }
                return (<motion.div animate={{ margin: '.5px' }} transition={{ type: 'spring', duration: 0.5 }} className="w-8 h-8 tile" style={style} id={col.id} key={row[0].info.split(',')[0] + '' + col.id}>
                  {/* <div className={animaterClass} style={animaterStyle}></div> */}
                  <p className="m-0 text-xs hidden tileText" style={{ color: col.owner ? 'white' : 'black' }}>{col.info}</p>
                </motion.div>);
              })}
          </div>)
        }
      </div>
      <div onClick={run} id='create' className="rounded justify-center items-center flex cursor-pointer text-white px-5 py-2"
              style={{ backgroundColor: color1 ,boxShadow: '0px 3px 3px 0px rgba(0,0,0,0.2)' }}>RUN</div>
    </div>
  );
};

export default Board;