// @flow 
import { title } from 'process';
import * as React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import '../index.css'

const color1 = '#E63E6D';
const color2 = '#0F52BA'

type Tile = {
  id: string;
  isUserPresent: undefined | User;
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

export const Game = () => {

  const tempRow: Tile[][] = [];
  for (let i = 0; i < 19; i++){
    const tempCol: Tile[] = [];
    for (let j = 0; j < 19; j++)
      tempCol.push({id: i+','+j, isUserPresent: undefined, isOccupiedBy: undefined});
    tempRow.push(tempCol);
  }

  const [boardData, setBoardData] = useState<Tile[][]>(tempRow);
  const boardAnimation = useState<boolean[][]>([]);

  const Tile = (props: Tile) => {
    let userColor = '#fff'
    if (props.isUserPresent) userColor = props.isUserPresent.color;
    const style: any = {
      margin: '.5px',
      cursor: 'pointer',
    }
    useEffect(() => {
      const tileDoc = document.getElementById(props.id);
      console.log(tileDoc?.style.backgroundColor)
      if (props.isOccupiedBy && tileDoc ) {
      tileDoc.style.backgroundColor = props.isOccupiedBy.color;
    }
    })
    return (
      <div className=" w-8 h-8 tile" style={style} id={props.id}>
        {!props.isUserPresent && <p className="m-0 text-xs hidden tileText" style={{ color: props.isOccupiedBy ? 'white' : 'black' }}>{props.id}</p>}
        {props.isUserPresent && <div className="m-0 w-6 h-6 text-sm text-white flex justify-center items-center rounded-full" style={{ backgroundColor: userColor }}>{ props.isUserPresent.name.toUpperCase()[0] }</div>}
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
    position: [18, 18],
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

  const run = () => {
    jump(1, 17, user1);
    jump(1, 1, user2);
    attack([4,16], user1);
  }

  const jump = (i: number, j: number, user: User) => {
    const temp = getCopiedData();
    if (user.name === 'lokesh') user2.position = [i, j];
    else user1.position = [i, j];
    temp[i][j].isUserPresent = user;
    setBoardData(temp);
  }

  const attackFrom = (from: number[], to: number[], user: User) => {

  }

  const attack = async (to: number[], user: User) => {
    const from = user.position;
    await occupy(from, user);
    while (!(from[0] == to[0]) || !(from[1] == to[1])) {
      if (from[0] < to[0]) from[0]++;
      else if (from[0] > to[0]) from[0]--;
      if (from[1] < to[1]) from[1]++;
      else if (from[1] > to[1]) from[1]--;
      await occupy(from, user);
    }
  }

  const occupy = async (position: number[], user: User) => {
    const temp = getCopiedData();
    temp[position[0]][position[1]].isOccupiedBy = user;
    setBoardData(temp);
    await sleep(250);
  }

  const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(() => resolve(ms), ms));
  }

  const getCopiedData = () => {
    const tempRow: Tile[][] = [];
    boardData.map(row => {
      const tempCol: Tile[] = [];
      row.map(col => tempCol.push(col));
      tempRow.push(tempCol);
    });
    return tempRow;
  }

  return (
    <div className="flex justify-center items-center bg-gray-900 w-3/4 h-screen">
      <div className="m-5">
        <div className="flex ml-8">
          {boardData.map(row => <InfoTile id={+row[0].id.split(',')[0]} key={row[0].id.split(',')[0]} />)}
        </div>
        {
          boardData.map(row =>
          <div className="flex justify-center" key={row[0].id.split(',')[0]}>
            <InfoTile id={+row[0].id.split(',')[0]} key={row[0].id.split(',')[0]} />
            {row.map(col => <Tile id={col.id} isUserPresent = {col.isUserPresent} isOccupiedBy = {col.isOccupiedBy} key={col.id} />)}
          </div>
        )}
      </div>
      <button onClick={run} className='text-white'>CLICK ME</button>
    </div>
  );
};