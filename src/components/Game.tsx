// @flow 
import { useSubscription } from '@apollo/client';
import gql from 'graphql-tag';
import { title } from 'process';
import * as React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { color1, color2 } from '../Config';
import '../index.css';
import { useLocation } from "react-router-dom";

type Tile = {
  id: string;
  attackType: string | undefined;
  isOccupiedBy: undefined | User;
}

type User = {
  id: string;
  name: string;
  position: number[];
  occupiedTiles: number[][];
  power: number;
  color: string;
}

type Room = {
  inbox: {
    message: string;
    type: string;
  };
  users: User[];
  move: {
    type: string;
    parameters: {
      to: position; 
      from: position;
      user: {
        id: string;
        name: string;
        color: string;
      };
      value: string;
    };
    returnValue: position;
    isCompleted: boolean;
  }
}

type position = {
  i: number;
  j: number
}

export const Game = () => {
  const location: any = useLocation();
  const roomId = location.state.roomId;
  console.log(roomId);
  const tempRow: Tile[][] = [];
  for (let i = 0; i < 19; i++){
    const tempCol: Tile[] = [];
    for (let j = 0; j < 19; j++)
      tempCol.push({id: i+','+j, attackType: undefined, isOccupiedBy: undefined});
    tempRow.push(tempCol);
  }

  const [boardData, setBoardData] = useState<Tile[][]>(tempRow);
  const boardDataRef = useRef<Tile[][]>(tempRow);

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
        move {
          type
          parameters {
            to {
              i
              j
            }
            from {
              i
              j
            }
            user {
              id
              name
              color
            }
            value
          }
          returnValue {
            i
            j
          }
          isCompleted
        }
      } 
    }
  `;

  const { data, loading } = useSubscription(
    ROOM_SUBSCRIPTION,
    { variables: { id: roomId } }
  );
  const roomdata: Room = data?.getroom;
  console.log(roomdata, loading);

  const Tile = (props: Tile) => {
    const style: any = {
      margin: '.5px',
      cursor: 'pointer',
    }
    style['backgroundColor'] = props.isOccupiedBy?.color;
    return (
      <div className=" w-8 h-8 tile" style={style} id={props.id}>
        <p className="m-0 text-xs hidden tileText" style={{ color: props.isOccupiedBy ? 'white' : 'black' }}>{props.id}</p>
      </div>
    );
  }

  const InfoTile = (props:{id: number}) => {
    return <div className="w-8 h-8 flex items-center text-white justify-center" style={{margin: '.5px'}}>
      <p className="m-0 text-sm">{ props.id }</p>
    </div>
  }

  const user1 = {
    id: 'someId',
    name: 'jithendhra',
    position: [0, 0],
    occupiedTiles: [],
    power: 100,
    color: color1
  };

  const user2 = {
    id: 'someId',
    name: 'lokesh',
    position: [0, 0],
    occupiedTiles: [],
    power: 100,
    color: color2
  };

  console.log('in main');

  const run = async () => {
    await attack([18, 1], user2);
    await moveTo([18, 18], user1);
    await moveTo([1, 1], user1);
    await moveTo([1, 18], user1);
    await moveTo([18, 18], user1);
    await moveTo([1, 1], user1);
    await moveTo([1, 18], user1);
    //await attack([1, 1], user1);
    //await attackFrom([18, 1], [18, 18], user2);
  }

  const jump = async (to: number[], user: User) => {
    const userDoc = document.getElementById('user1');
    const top = 2.3;
    const left = 2.3;
    if (userDoc) {
      userDoc.style.top = (top + 2.0625 * to[0]) + 'rem';
      userDoc.style.left = (left + 2.0625 * to[1]) + 'rem';
    }
    if (user.name == 'lokesh') user2.position = to.map(a => a);
    else user1.position = to.map(a => a);
    await sleep(250);
  }

  const moveTo = async (to: number[], user: User) => {
    const from = user.position.map(a => a);
    while (!(from[0] == to[0]) || !(from[1] == to[1])) {
      if (from[0] < to[0]) from[0]++;
      else if (from[0] > to[0]) from[0]--;
      if (from[1] < to[1]) from[1]++;
      else if (from[1] > to[1]) from[1]--;
      await jump(from, user);
    }
  }

  const attackFrom = async (from: number[], to: number[], user: User) => {
    await occupy(from, user);
    while (!(from[0] == to[0]) || !(from[1] == to[1])) {
      if (from[0] < to[0]) from[0]++;
      else if (from[0] > to[0]) from[0]--;
      if (from[1] < to[1]) from[1]++;
      else if (from[1] > to[1]) from[1]--;
      await occupy(from, user);
    }
    setBoardData(boardDataRef.current.map(a => a.map(a => a)));
  }

  const attack = async (to: number[], user: User) => {
    const from = user.position;
    await attackFrom(from, to, user);
  }

  const occupy = async (position: number[], user: User) => {
    boardDataRef.current[position[0]][position[1]].isOccupiedBy = user;
    const doc = document.getElementById(position.toString());
    if(doc) doc.style.backgroundColor = user.color;
    await sleep(250);
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(() => resolve(ms), ms));

  return (
    <div className="flex justify-center items-center bg-gray-900 w-1/2 overflow-auto h-screen">
      <div className="m-5 relative">
        <div id='user1' className="absolute m-0 w-6 h-6 text-sm text-white flex justify-center items-center rounded-full"
          style={{ backgroundColor: user1.color, top: '2.3rem', left: '2.3rem', transition: 'all .2s ease' }}>{user1.name.toUpperCase()[0]}</div>
        <div className="flex ml-8">
          {boardData.map(row => <InfoTile id={+row[0].id.split(',')[0]} key={row[0].id.split(',')[0]} />)}
        </div>
        {
          boardData.map(row =>
          <div className="flex justify-center" key={row[0].id.split(',')[0]}>
            <InfoTile id={+row[0].id.split(',')[0]} key={row[0].id.split(',')[0]} />
            {row.map(col => <Tile id={col.id} attackType = {col.attackType} isOccupiedBy = {col.isOccupiedBy} key={col.id} />)}
          </div>
        )}
      </div>
    </div>
  );
};