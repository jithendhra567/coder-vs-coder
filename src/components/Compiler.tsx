import { gql, useSubscription } from '@apollo/client';
import * as React from 'react';
import { useRef } from 'react';
import { setTimeout } from 'timers';
import CodeMirror, { IEditorInstance } from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import gsap from 'gsap';
import { Constants, green, Move, Moves, Room, roomDataAtom, Terminal } from '../utils/constant';
import { useEffect } from 'react';
import { createRef } from 'react';
import { useLocation } from 'react-router-dom';

type CompilerProps = {
  roomData: Room | undefined;
  moves: Moves;
  completedMoves: Moves;
};

const Compiler = (props: CompilerProps) => {

  //constants
  const [terminals, setTerminals] = React.useState<Terminal[]>([{ id: 0, status: 0, code: '', }]);
  const location: any = useLocation();
  const roomId: string = location.state.roomId;
  const userName: string = location.state.userName;
  const userId: string = location.state.userId;
  const isLeader: boolean = location.state.isLeader;

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
    const moveId = new Date().getTime() + (Math.random()*100)+ "__" + roomId + "__" + userName;
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
    console.log(addMove(move));
    await fetchGraphQL(addMove(move), "MyMutation", {}).then(res=> console.log('succes',res)).catch(err=> console.log('err'));
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
    `;
    setTimeout(methods, 1);
  }, []);

  const Terminal = (props: Terminal) => {
    const runRef = createRef<HTMLParagraphElement>();
    const codeRef: any = createRef<IEditorInstance>();
    const layoutRef = createRef<HTMLDivElement>();
    useEffect(() => {
      if (props.status === 0) {
        gsap.from(layoutRef.current, {
          duration: 0.5,
          width: 0,
        });
      }
      else {
        gsap.to(runRef.current, {
          duration: 0.5,
          background: 'grey',
          boxShadow: '0px 0px 0px 0px',
        })
      }
    });
    const run = () => {
      if (props.status !== 0) return;
      const tempTerminals = [...terminals];
      tempTerminals[props.id].status = 1;
      const code = codeRef.current.editor.getValue();
      tempTerminals[props.id].code = code;
      tempTerminals.push({ id: props.id + 1, status: 0, code: props.code });
      setTimeout(code, 1);
      setTerminals(tempTerminals);
    }
    return (
      <div ref={layoutRef} className="bg-white p-4 my-4" style={{ boxShadow: '2px 3px 5px 0px rgba(0,0,0,0.2)', borderLeft: '5px solid '+green, borderRadius: '3px 10px 10px 2px'}}>
        <div className="flex items-center justify-between mb-2">
          <p>Write Code here</p>
          <p onClick={run} ref={runRef} className='cursor-pointer text-center py-1 px-4 rounded text-sm text-white' style={{ boxShadow: '3px 4px 5px 0px rgba(0,0,0,0.2)', background: green}}>▶</p>
        </div>
        <CodeMirror ref={codeRef} value={props.code} options={{ theme: 'monokai', keyMap: 'sublime', mode: 'js', readOnly: props.status===1}}/>
      </div>
    );
  }

  return (
    <div className="h-full w-1/2 relative compiler">
      <div className="w-full bg-white-900" style={{boxShadow: '0px 2px 10px 5px rgba(0,0,0,0.2)', height: '5%'}}></div>
      <div className="p-5" style={{ height: '90%', overflowY: 'scroll' }}>
        {terminals.map(terminal => <Terminal key={terminal.id} id={terminal.id} code={terminal.code} status={terminal.status} powerUsed={terminal.powerUsed}/>)}
      </div>
      <div className="w-full bg-white-900" style={{boxShadow: '0px 5px 10px 5px rgba(0,0,0,0.2)', height: '5%'}}></div>
    </div>
  );
};

export default Compiler;