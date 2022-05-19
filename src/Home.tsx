import React, { Component } from 'react';
import { useRef } from 'react';
import { color1, color2 } from './utils/constant';
import { useHistory } from 'react-router-dom';
import { Constants } from './utils/constant';

const Home = () => {

  const isJoining = useRef(false);
  const history = useHistory();

  const login = async (name: string, color: string, roomId: string, position: [number, number], userId: string) => {
    const addRoom = `
      mutation MyMutation {
        addroom(input: {id: "${roomId}", inbox: {message: "welcome to my world", type: "welcome"}}) {
          numUids
        }
      }      
    `;
    const { errors, data } = await fetchGraphQL(addRoom, 'MyMutation', {});
    await addUserToRoom(name, color, roomId, position, userId);
    if (errors) console.error(errors);
    else {
      history.push({ pathname: '/game', state: { roomId: roomId, userName: name, isLeader: true, userId: userId } });
    }
  } 

  const joinRoom = async (name: string, color: string, roomId: string, position: [number, number], userId: string) => {
    addUserToRoom(name, color, roomId, position, userId);
    history.push({ pathname: '/game', state: { roomId: roomId, userName: name, isLeader: false, userId: userId } });
  }
  
  const addUserToRoom = async (name: string, color: string, roomId: string, position: [number, number], userId: string) => {
    const addUser = `
      mutation MyMutation {
        adduser(input: {id: "${userId}", color: "${color}", name: "${name}", position: {i: ${position[0]}, j: ${position[1]}}, power: 100, roomInfo: {id: "${roomId}"}}) {
          numUids
        }
      }    
    `;
    const { errors, data } = await fetchGraphQL(addUser, 'MyMutation', {});
    if (errors) alert(errors + "something went wrong");
  }

  const join = () => {
    const loginDoc = document.getElementById('login');
    const createDoc = document.getElementById('create');
    const roomIdDoc:any = document.getElementById('roomId');
    const nameDoc: any = document.getElementById('name');
    if (nameDoc && roomIdDoc && isJoining.current) {
      joinRoom(nameDoc.value, color2, roomIdDoc.value, [24, 24], nameDoc.value+""+new Date().getTime());
      return;
    }
    if (loginDoc && createDoc && roomIdDoc) {
      loginDoc.style.boxShadow = '0px 0px 25px 25px rgba(0,0,0,0.2)';
      loginDoc.style.width = '300px';
      loginDoc.style.height = '250px';
      createDoc.innerText = 'CANCEL';
      createDoc.style.backgroundColor = color2;
      roomIdDoc.style.display = 'block'
      isJoining.current = true;
      return;
    }
  }

  const create = () => {
    const nameDoc:any = document.getElementById('name');
    if (isJoining.current) {
      const loginDoc = document.getElementById('login');
      const createDoc = document.getElementById('create');
      const roomIdDoc = document.getElementById('roomId');
      if (loginDoc && createDoc && roomIdDoc) {
        loginDoc.style.boxShadow = '0px 0px 5px 5px rgba(0,0,0,0.2)';
        loginDoc.style.width = '250px';
        loginDoc.style.height = '150px';
        createDoc.innerText = 'CREATE';
        createDoc.style.backgroundColor = color1;
        roomIdDoc.style.display = 'none'
        isJoining.current = false;
        return;
      }
    }
    if (nameDoc) {
      const name = nameDoc.value;
      const roomId = Math.floor(Math.random() * 899999 + 100000);
      login(name, color1, roomId + '', [0, 0], name+""+new Date().getTime());
    }
  }



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

  return (
    <div className='flex h-screen font-serif'>
      <div className="w-1/2 h-full justify-evenly flex flex-col items-center">
        <p className="text-3xl " style={{fontFamily: 'ui-monospace'}}>ME vs ME</p>
        <div className="w-3/4 h-3/4 rounded" style={{boxShadow: '0px 2px 5px 0px rgba(0,0,0,0.2)'}}>
        </div>
      </div>
      <div className="w-1/2 bg-gray-800 h-full justify-center items-center flex">
        <div className="bg-white rounded flex-col justify-evenly items-center flex p-5" id='login'
          style={{ boxShadow: '0px 0px 5px 5px rgba(0,0,0,0.2)', width: '250px', height: '150px', transition: 'width,height .25s ease' }}>
          <input type="text" id='name' className='m-2 w-full rounded' placeholder='Enter your name' />
          <input type="text" id='roomId' className='m-2 w-full hidden rounded' placeholder='Enter your joining code' />
          <div className="flex w-full justify-between">
            <div onClick={join} className="rounded justify-center items-center flex cursor-pointer text-white px-5 py-2"
              style={{ backgroundColor: color1, boxShadow: '0px 3px 3px 0px rgba(0,0,0,0.2)' }}>JOIN</div>
            <div onClick={create} id='create' className="rounded justify-center items-center flex cursor-pointer text-white px-5 py-2"
              style={{ backgroundColor: color1 ,boxShadow: '0px 3px 3px 0px rgba(0,0,0,0.2)' }}>CREATE</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;