import React from "react";
import ProfileImage from '../img/profile.svg';
import ProfileModal from "./modals/ProfileModal";
import "./Topbar.css";

export default function Topbar() {
  const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);

  return (
    <div className={'flex flex-col justify-end items-end'}>
      <div className={'h-12 w-full bg-white flex flex-row justify-between items-center px-5 border-solid border-b-2 border-gray-200'}>
        <div>
          <input id={'topbar-search'} type={"text"} placeholder={"Search"} />
        </div>
        <div onClick={() => setModalIsOpen(!modalIsOpen)} className={'ml-4'}>
          <img src={ProfileImage} alt="profile" />
        </div>
      </div>

      {
        modalIsOpen ? 
          <div style={{position: 'absolute', top: '40px'}} className={'m-4 cursor-pointer'}>
            <ProfileModal />
          </div>
          : null
      }
    </div>
  )
}