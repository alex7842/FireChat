import React from 'react'

import { useContext } from 'react';
import UserContext from './context/context';
import ChatDm from './ChatDm';
import { Signin } from './Signin';
import HomeIntro from './HomeIntro';
import { SideBar } from './SideBar';

export const Home = () => {
  const { user } = useContext(UserContext);
    console.log("from home",user);
  return (
    <>
    {
user ?
<>
   <HomeIntro/>
   </>
  
  
    :<Signin/>
}
    </>

  )
}
