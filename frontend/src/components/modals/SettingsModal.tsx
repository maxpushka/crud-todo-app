import React from "react";
import userLogout from "../../utils/userLogout";
import Profile from '../../img/profile.svg';
import Logout from '../../img/log-out.svg';
import { AppCtx } from "../../App";

export default function SettingsModal() {
  const appCtx = React.useContext(AppCtx);

  return (
    <div id={'sidebar-modal'} className={'bg-white flex flex-col items-center'}>
      <button style={{width: '170px', height: '140px', borderRadius: '4px'}} className={'mx-2 mb-1 mt-2 pl-2 flex flex-row items-center hover:bg-gray-100'}>
        <img src={Profile} alt="Profile" className={'mr-4'} style={{width: '20px', height: '20px'}} />
        <span>Profile</span>
      </button>
      <button onClick={() => userLogout(appCtx)}
          style={{width: '170px', height: '140px', borderRadius: '4px'}} 
          className={'mx-2 mb-2 mt-1 pl-2 flex flex-row items-center hover:bg-gray-100'}>
        <img src={Logout} alt="Log out" className={'mr-4'} style={{width: '18px', height: '18px'}} />
        <span>Log out</span>
      </button>
    </div>
  )
}