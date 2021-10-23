import React from "react";
import { AppCtx } from "../App";
import './Sidebar.css';
import getLists from '../utils/lists/getLists';
import createList from '../utils/lists/createList';
import deleteList from '../utils/lists/deleteList';
import SettingsModal from "./modals/SettingsModal";
import { Task } from "../App";

import OpenwareLogoSmall from '../img/logo-openware-small.svg';
import CollapseArrow from '../img/collapse-arrow.png';
import PlusSign from '../img/plus.svg';
import Settings from '../img/settings.svg';
import Globe from '../img/globe.svg';
import Cog from '../img/cog.svg';
import ListSign from '../img/list.svg';
import DeleteList from '../img/black-trash.svg';

export default function Sidebar() {
  const appCtx  = React.useContext(AppCtx);

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [lists, setLists] = React.useState([]);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [newlistName, setNewlistName] = React.useState('New List');

  React.useEffect(() => {
    getLists(appCtx);
  }, [])

  React.useEffect(() => {
    const arr = [];
    let key = 0;
    for (let [, value] of Object.entries(appCtx.listsObj)) {
      arr.push(newListButton(key++, (value as Task).name, (value as Task).id));
    }
    setLists(arr);
  }, [appCtx.listsObj, isCollapsed])

  function newListButton(key, name, listId) {
    return (
      <div key={String(key)} onClick={() => appCtx.setSelectedListId(listId)} className={'mb-3 flex flex-row justify-between items-center>'}>
        <div className={'flex flex-row justify-start items-center cursor-pointer'}>
          <img src={ListSign} alt="" style={{width: '15.33px', height: '15.33px'}} className={'mr-3'}/>
          {isCollapsed ? null : <span>{name}</span>}
        </div>
        <div className={'flex flex-row justify-end items-center cursor-pointer'}>
          {isCollapsed ? null : <img src={DeleteList} alt={'delete list'} onClick={() => deleteList({appCtx, listId})} className={'mr-3'}/>}
        </div>
      </div>
    )
  }

  function handleListCreation() {
    createList({appCtx, listName: newlistName}).then(() => handleNewlistNameChange({target: {value: 'New List'}}))
  }

  const handleNewlistNameChange = (event) => setNewlistName(event.target.value);

  return (
    <>
      <div style={{backgroundColor: '#FCD620'}} className={`h-screen ${isCollapsed ? 'w-12' : 'w-64'} flex flex-col justify-between`}>
        <div className={`mt-4 ${isCollapsed ? 'ml-4' : 'ml-6'} flex flex-col justify-start`}>
          <img src={OpenwareLogoSmall} alt={"Openware"} style={{width: '24px', height: '17px'}} className={'mt-4 mb-8'}/>
          <button className={'mb-5'} onClick={() => setIsCollapsed(!isCollapsed)}>
            <img src={CollapseArrow} alt="collapse" className={isCollapsed ? 'transform rotate-180' : ''}/>
          </button>
          {lists}
          <button type={'button'} onClick={() => setIsCollapsed(false)} className={'flex flex-row justify-between items-center'}>
            <div className={'flex flex-row justify-start items-center'}>
              <img src={PlusSign} alt="" style={{width: '15.33px', height: '15.33px'}} className={'mr-3'}/>
              {isCollapsed ? null : <input type={'text'} style={{backgroundColor: '#FCD620'}} className={'w-24'} value={newlistName} onChange={handleNewlistNameChange}/>}
            </div>
            <div className={'flex flex-row justify-end items-center mr-4'}>
              {isCollapsed ? null : <button onClick={handleListCreation} className={'cursor-pointer'}>Add</button>}
            </div>
          </button>
        </div>

        <div className={`mb-5 flex ${isCollapsed ? 'flex-col' : 'flex-row'} justify-evenly items-center`}>
          <button className={`${isCollapsed ? 'mb-3' : ''}`}><img src={Settings} alt="settings" /></button>
          <button className={`${isCollapsed ? 'mb-3' : ''}`}><img src={Globe} alt="globe" /></button>
          <button className={`${isCollapsed ? '' : ''}`} onClick={() => setModalIsOpen(!modalIsOpen)}><img src={Cog} alt="cog" /></button>
        </div>
      </div>

      {modalIsOpen ? <SettingsModal /> : null}
    </>
  )
}