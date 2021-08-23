import { gql, useSubscription } from '@apollo/client';
import * as React from 'react';
import { setTimeout } from 'timers';

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

  return (
    <div className="h-screen w-1/2">
      <textarea name="compiler" id="compiler" cols={30} rows={10}></textarea>
      <button onClick={run}>Click</button>
    </div>
  );
};

export default Compiler;