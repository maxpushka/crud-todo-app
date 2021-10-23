import React from 'react';
import renameList from '../../utils/lists/renameList';
import RenameIcon from '../../img/rename.svg';
import { AppContext } from '../../App';

export type RenameModalProps = {
  setRenameModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function RenameModal({setRenameModalIsOpen}: RenameModalProps) {
  const appCtx = React.useContext(AppContext);
  if (appCtx === null) {
    throw new Error('appCtx is null');
  }

  const [newListName, setNewListName] = React.useState<string>('New name');

  const handleNewNameInput = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNewListName(event.target.value);
  }

  function dispatchRename() {
    if (appCtx !== null) {
      renameList({appCtx, newName: newListName}).then(() => setRenameModalIsOpen(false));
    }
  }

  return (
    <div className={'todolist-modal ml-11 p-2 bg-white flex flex-col items-center'}>
      <input autoFocus type={'text'} style={{border: '1px solid #E5E7EB'}} value={newListName} onChange={handleNewNameInput} />
      <button onClick={dispatchRename}
          style={{width: '170px', height: '50px', borderRadius: '4px'}}
          className={'mx-2 mb-1 mt-2 pl-2 flex flex-row items-center hover:bg-gray-100'}>
        <img src={RenameIcon} alt="rename list" className={'mr-4'} style={{width: '20px', height: '20px'}} />
        <span>Rename list</span>
      </button>
      <button onClick={() => setRenameModalIsOpen(false)}
          style={{width: '170px', height: '50px', borderRadius: '4px'}} 
          className={'mx-2 mb-2 mt-1 pl-2 flex flex-row items-center hover:bg-gray-100'}>
        <span className={'mr-4'} style={{color: '#D70000'}}>X</span>
        <span style={{color: '#D70000'}}>Cancel renaming</span>
      </button>
    </div>
  )
}