import { Move, position } from "./constant";

export const addMove = (move: Move) => `
  mutation MyMutation {
    addmove(input: {id: "${move.id}", type: "${move.type}", makingMoves: {id: "${move.makingMoves.id}"},
      parameters: {to: {i: ${move.parameters?.to?.i}, j: ${move.parameters?.to?.j}}, userId: "${move.parameters?.userId}"}}) {
      numUids
    }
  }
  `;

export const deleteMove = (moveId: string) => `
  mutation MyMutation {
    deletemove(filter: {id: {eq: "${moveId}"}}) {
      msg
      numUids
    }
  }
`;

export const linkWithCompletedMoves = (moveId: string, returnValue: position, roomId: string) => `
  mutation MyMutation {
    updatemove(input: {filter: {id: {eq: "${moveId}"}}, set: {returnValue: {i: ${returnValue.i}, j: ${returnValue.j}} ,completedMoves: {id: "${roomId}__completedMoves"}}}) {
      numUids
    }
  }  
`;

export const fetchGraphQL = async (operationsDoc: any, operationName: any, variables: any) => {
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