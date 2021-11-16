import { atom } from "recoil";

export class Constants {
  static makingMoves = 'makingMoves';
  static completedMoves = 'completedMoves';
}

export type Room = {
  inbox: {
    message: string;
    type: string;
  };
  users: User[];
}

export type Moves = {
  id: string;
  moves: Move[];
}

export type Move = {
  id: string;
  makingMoves: {
    id: string;
  },
  completedMoves?: {
    id: string;
  },
  type?: "move" | "jump" | "attack";
  parameters?: {
    to?: position; 
    from?: position;
    userId: string;
    value?: string;
  };
  returnValue?: position;
}

export type position = {
  i: number;
  j: number
}

export type Terminal = {
  id: number,
  status: -1 | 0 | 1;
  code: string,
  powerUsed?: number,
}

export const color1 = '#0F52BA';

export const color2 = '#E63E6D';

export const green = '#00BB7F';

export type User = {
  id: string;
  name: string;
  position: position;
  occupiedTiles: number[][];
  power: number;
  color: string;
}

export type Tile = {
  id: string;
  info: string;
  attackType?: string;
  moveId?: string;
  owner?: string;
}

export type TileRow = {
  id: string;
  tiles: Tile[];
}

const sample: User = {id: '', name: '', position: {i:0, j:0}, occupiedTiles: [], power: 0, color: ''}

export const roomDataAtom = atom({
  key: 'roomData',
  default: {
    inbox: {
      message: '',
      type: '',
    },
    users: [sample],
  }
});

export const usersAtom = atom({
  key: 'users',
  default: []
});

export const debounce = (fun: Function, delay: number) => {
  let timer: number;
  return () => {
    clearTimeout(timer);
    setTimeout(() => fun(), delay);
  }
}