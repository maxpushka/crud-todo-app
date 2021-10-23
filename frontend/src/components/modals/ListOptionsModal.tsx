import React from 'react';
import { AppContext } from '../../App';
import RedTrashIcon from '../../img/red-trash.svg';
import RenameIcon from '../../img/rename.svg';
import deleteList from '../../utils/lists/deleteList';

type ListOptionsModalProps = {
  setListOptionsModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setRenameModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ListOptionsModal({ setListOptionsModalIsOpen, setRenameModalIsOpen }: ListOptionsModalProps) {
  const appCtx = React.useContext(AppContext);

  function handleRename() {
    setListOptionsModalIsOpen(false); 
    setRenameModalIsOpen(true);
  }

  function handleDelete() {
    if (appCtx !== null) {
      deleteList({appCtx, listId: appCtx.selectedListId}).then(() => setListOptionsModalIsOpen(false));
    }
  }

  return (
    <div className={'todolist-modal ml-11 bg-white flex flex-col items-center'}>
      <p className={'text-center w-full font-medium text-black border-solid border-b-2 border-gray-200'}>List options</p>
      <button onClick={handleRename} style={{width: '170px', height: '50px', borderRadius: '4px'}} 
          className={'mx-2 mb-1 mt-2 pl-2 flex flex-row items-center hover:bg-gray-100'}>
        <img src={RenameIcon} alt="rename list" className={'mr-4'} style={{width: '20px', height: '20px'}} />
        <span>Rename list</span>
      </button>
      <button onClick={handleDelete}
          style={{width: '170px', height: '50px', borderRadius: '4px'}} 
          className={'mx-2 mb-2 mt-1 pl-2 flex flex-row items-center hover:bg-gray-100'}>
        <img src={RedTrashIcon} alt="Delete list" className={'mr-4'} style={{width: '18px', height: '18px'}} />
        <span style={{color: '#D70000'}}>Delete list</span>
      </button>
    </div>
  )
}