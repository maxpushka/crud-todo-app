import React from "react";
import "./ProfileModal.css";
import { AppCtx } from "../../App";
import OpenwareLogoSmall from '../../img/logo-openware-small.svg';
import UserAvatar from '../../img/user-avatar.png';
import userLogout from "../../utils/userLogout";

export default function ProfileModal({style={}}) {
  const appCtx = React.useContext(AppCtx);

  return (
    <div id={'profile-modal'} style={style}>
      <div className={'flex flex-row justify-between mb-4'}>
        <div className={'flex flex-row items-center'}>
          <img src={OpenwareLogoSmall} alt={"Openware"} style={{width: '22px', height: '15px'}} className={'pr-1.5'}/>
          <span className={'font-sans font-medium text-sm text-gray-500'}>Todo</span>
        </div>
        <button onClick={() => userLogout(appCtx)} className={'hover:underline hover:cursor-pointer font-normal text-sm text-gray-400'}>Sign out</button>
      </div>
      <div className={'flex flex-row justify-around'}>
        <img src={UserAvatar} alt={'user avatar'} />
        <div>
          <p>{appCtx.userEmail}</p>
          <p style={{color: '#FCD620'}} className={'text-xs hover:underline hover:cursor-pointer'}>My profile</p>
        </div>
      </div>
    </div>
  )
}