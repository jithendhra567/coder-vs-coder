import { gql, useSubscription } from '@apollo/client';
import * as React from 'react';
import { useRef } from 'react';
import { setTimeout } from 'timers';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';

type Props = {
  
};

const Compiler = (props: Props) => {

  const run = () => {
    const data: any = document.getElementById('compiler');
    const code = data.value;
    setTimeout(data.value, 1);
  }

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

  const Terminal = () => {

    return (
      <div className="bg-white rounded p-4 my-2" style={{ boxShadow: '0px 3px 10px 0px rgba(0,0,0,0.2)' }}>
        <div className="flex items-center justify-between mb-2">
          <p>CODE</p>
          <div className="w-8 h-8 flex justify-center items-center rounded-full p-2" style={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
            <div style={{width: '0', height: '0',  borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft:'10px solid black'}}/>
          </div>
        </div>
        <CodeMirror value='//write your code' options={{ theme: 'monokai', keyMap: 'sublime', mode: 'js'}}/>
      </div>
    );
  }

  return (
    <div className="h-screen w-1/2">
      <div className="w-full bg-white-900" style={{boxShadow: '0px 5px 10px 5px rgba(0,0,0,0.2)', height: '50px'}}></div>
      <div className="h-full p-5" style={{ height: 'calc(100%-50px)'}}>
        <Terminal/>
      </div>
    </div>
  );
};

export default Compiler;