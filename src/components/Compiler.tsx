import { gql, useSubscription } from '@apollo/client';
import * as React from 'react';
import { useRef } from 'react';
import { setTimeout } from 'timers';
import CodeMirror, { IEditorInstance } from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import gsap from 'gsap';
import { green, Terminal } from '../utils/constant';
import { useEffect } from 'react';
import { createRef } from 'react';

type Props = {
  
};

const Compiler = (props: Props) => {

  const [terminals ,setTerminals] = React.useState<Terminal[]>([{id: 0, status: 0, code: '',}]);

  // const USER_SUBSCRIPTION = gql`
  //   subscription MySubscription($id: String!) {
  //     getuser(id: $id) {
  //       id
  //       name
  //     }
  //   }
  // `;

  // function LatestUser() {
  //   const { data, loading } = useSubscription(
  //     USER_SUBSCRIPTION,
  //     { variables: { id: '1' } }
  //   );
  //   console.log(data,loading)
  //   return <h4>New comment: {loading}</h4>;
  // }

  // const fetchGraphQL = async (operationsDoc: any, operationName: any, variables: any) => {
  //   const result = await fetch(
  //     'https://green-wave.ap-south-1.aws.cloud.dgraph.io/graphql',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-Auth-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzL3Byb3h5IiwiZHVpZCI6IjB4MjM0ZjAwYyIsImV4cCI6MTYyOTUzODE3NCwiaXNzIjoicy9hcGkifQ.YYmqbdYGBPJnPfDmAJKrR87m58WGPuCVdLKJq01GbuA'
  //       },
  //       body: JSON.stringify({
  //         query: operationsDoc,
  //         variables: variables,
  //         operationName: operationName
  //       })
  //     }
  //   );
  //   return await result.json();
  // }

  // const operationsDoc = `
  //   mutation MyMutation {
  //     adduser(input: {name: "jithendhra", id: "1"}) {
  //       numUids
  //     }
  //   }
  // `;

  // const start = async () => {
  //   const { errors, data } = await fetchGraphQL(
  //     operationsDoc,
  //     'MyMutation',
  //     {}
  //   );;

  //   if (errors) {
  //     // handle those errors like a pro
  //     console.error(errors);
  //   }

  //   // do something great with this precious data
  //   console.log(data);
  // }

  // const operationsDocType = `const operationsDoc = \`
  //   mutation MyMutation {
  //     adduser(input: {name: "jithendhra", id: "1"}) {
  //       numUids
  //     }
  //   }
  // \`;`;

  // const methods: any = 'const fetchGraphQL = ' + fetchGraphQL.toString() + '\n'
  //   + operationsDocType
  //   + 'const start = '+ start.toString();

  // setTimeout(methods, 1);

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
        console.log(codeRef.current.textarea.value);
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
      tempTerminals.push({id: props.id+1, status: 0, code: props.code});
      setTerminals(tempTerminals);
    }
    return (
      <div ref={layoutRef} className="bg-white p-4 my-4" style={{ boxShadow: '2px 3px 5px 0px rgba(0,0,0,0.2)', borderLeft: '5px solid '+green, borderRadius: '3px 10px 10px 2px'}}>
        <div className="flex items-center justify-between mb-2">
          <p>CODE</p>
          <p onClick={run} ref={runRef} className='cursor-pointer text-center py-1 px-4 rounded text-sm text-white' style={{ boxShadow: '3px 4px 5px 0px rgba(0,0,0,0.2)', background: green}}>▶</p>
        </div>
        <CodeMirror ref={codeRef} value='//write your code' options={{ theme: 'monokai', keyMap: 'sublime', mode: 'js'}}/>
      </div>
    );
  }

  return (
    <div className="h-screen w-1/2 relative">
      <div className="w-full bg-white-900 absolute top-0" style={{boxShadow: '0px 5px 10px 5px rgba(0,0,0,0.2)', height: '50px'}}></div>
      <div className="p-5" style={{ maxHeight: 'calc(100%-50px)', marginTop: '50px', overflow: 'auto' }}>
        {terminals.map(terminal => <Terminal key={terminal.id} id={terminal.id} code={terminal.code} status={terminal.status} powerUsed={terminal.powerUsed}/>)}
      </div>
    </div>
  );
};

export default Compiler;