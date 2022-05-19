import * as React from 'react';
import { useRef } from 'react';
import vm from 'vm';
import CodeMirror, { IEditorInstance } from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/material.css';
import gsap from 'gsap';
import { color1, color2, Constants, green, Move, Moves, red, Room, roomDataAtom, Terminal, User } from '../utils/constant';
import { useEffect } from 'react';
import { createRef } from 'react';
import { useLocation } from 'react-router-dom';

type CompilerProps = {
  roomData: Room | undefined;
  moves: Moves;
  completedMoves: Moves;
};

const Compiler = (props: {users: User[]}) => {

  //constants
  const [terminals, setTerminals] = React.useState<Terminal[]>([]);
  const location: any = useLocation();
  const roomId: string = location.state.roomId;
  const userName: string = location.state.userName;
  const userId: string = location.state.userId;
  const isLeader: boolean = location.state.isLeader;
  const codeRef: any = createRef<IEditorInstance>();

  //methods 
  const fetchGraphQL = async (operationsDoc: any, operationName: any, variables: any) => {
    const result = await fetch(
      'https://green-wave.ap-south-1.aws.cloud.dgraph.io/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzL3Byb3h5IiwiZHVpZCI6IjB4MjM0ZjAwYyIsImV4cCI6MTYyOTUzODE3NCwiaXNzIjoicy9hcGkifQ.YYmqbdYGBPJnPfDmAJKrR87m58WGPuCVdLKJq01GbuA'
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
        parameters: {to: {i: ${move.parameters?.to?.i}, j: ${move.parameters?.to?.j}}, userId: "${move.parameters?.userId}"}}) {
        numUids
      }
    }
  `;
  const attack = async (i: number, j: number) => {
    const moveId = new Date().getTime() + "__" + roomId + "__" + userName;
    const move: Move = {
      id: moveId,
      makingMoves: {
        id: roomId + "__" + "makingMoves"
      },
      type: "attack",
      parameters: {
        to: {i: i,j: j},
        userId: userId,
      },
    };
    await fetchGraphQL(addMove(move), "MyMutation", {}).then(res => console.log(res));
  }

  const move = async (i: number, j: number) => {
    const moveId = new Date().getTime() + "__" + roomId + "__" + userName;
    const move: Move = {
      id: moveId,
      makingMoves: {
        id: roomId + "__" + "makingMoves"
      },
      type: "move",
      parameters: {
        to: {i: i,j: j},
        userId: userId,
      },
    };
    await fetchGraphQL(addMove(move), "MyMutation", {});
  }

  useEffect(() => {
    const methods: any = `
      const roomId = ${roomId};
      const userName = '${userName}';
      const userId = '${userId}';
      const isLeader = ${isLeader};
      const fetchGraphQL = ${fetchGraphQL.toString()}
      const addMove = ${addMove.toString()}
      const attack = ${attack.toString()}
      const move = ${move.toString()}
    `;
    setTimeout(methods, 1);
  }, []);

  const run = () => {
    const tempTerminals = [...terminals];
    const code = codeRef.current.editor.getValue();
    tempTerminals.unshift({ id: terminals.length, code: code });
    setTimeout(code, 1);
    codeRef.current.editor.setValue("");
    codeRef.current.editor.focus();
    setTerminals(tempTerminals);
  }

  const Terminal = (props: Terminal) => {
    const layoutRef = createRef<HTMLDivElement>();
    useEffect(() => {
      
    });
    return (
      <div ref={layoutRef} className="bg-white p-4 my-4" style={{ boxShadow: '3px 5px 5px 0px rgba(0,0,0,0.2)', borderRadius: '4px'}}>
        <div className="flex items-center justify-between mb-2">
          <p style={{color: color1}}>{"#" + props.id}</p>
          <div className="flex">
            <p>status: <span style={{color: green}}>executing...</span></p>
            <p className='ml-4'>consumed power: <span style={{color: red}}>10</span></p>
          </div>
        </div>
        <CodeMirror value={props.code} width='100%' height='90%' options={{ theme: 'material', keyMap: 'sublime', mode: 'js', readOnly: true}}/>
      </div>
    );
  }

  return (
    <div className="h-full w-1/2 relative compiler" style={{background: '#e7e7e7'}}>
      <div className="w-full flex items-center justify-between bg-white-900 shadow-xl bg-white" style={{ height: '7%' }}>
        <div className="mx-5 my-2">
          <p className="text-xs">You</p>
          <p className='text-xl font-bold'>1000</p>
        </div>
        <div className="flex items-center ">
          <p className='text-2xl font-bold'>#</p>
          <p className='text-xl font-bold ml-2'>{roomId}</p>
          <img src="https://cdn-icons-png.flaticon.com/128/126/126498.png" alt="" className='w-4 h-4 ml-2' />
        </div>
        <div className="mx-5 my-2">
          <p className="text-xs">{props.users[1]?props.users[1].name:"Wating for player"}</p>
          <p className='text-xl text-center font-bold'>1000</p>
        </div>
      </div>
      <div className="px-5 pb-8 pt-3 mx-3 mt-5 shadow-xl rounded" style={{ height: '36%', background: "#fff"}}>
        <div className="flex items-center justify-between mb-2 font-bold">
          <p>Write you're code</p>
          <p onClick={run} className='cursor-pointer text-center py-2 px-4 rounded text-sm text-white' style={{ boxShadow: '2px 2px 2px 0px rgba(0,0,0,0.2)', background: color1}}>Run</p>
        </div> 
        <CodeMirror ref={codeRef} width='100%' height='90%' options={{ theme: 'material', keyMap: 'sublime', mode: 'js', }} />
      </div>
      <div className="p-5" style={{ height: '50%', overflowY: 'scroll' }}>
        <h3 style={{background: '#fff', borderLeft: '5px solid '+color1}} className='p-2 rounded'>Recent codes</h3>
        {terminals.map(terminal => <Terminal key={terminal.id} id={terminal.id} code={terminal.code} powerUsed={terminal.powerUsed}/>)}
      </div>
      <div className="w-full bg-white-900 flex items-center justify-between" style={{boxShadow: '0px 5px 10px 5px rgba(0,0,0,0.2)', height: '5%'}}>
        <p></p>
        <img src="https://cdn-icons-png.flaticon.com/128/1286/1286853.png" alt="" className='w-6 mx-5' />
      </div>
    </div>
  );
};

export default Compiler;