/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {AppContext} from '../../App';
import deleteTask from '../../utils/tasks/deleteTask';
import {changeTaskStatus} from '../Todolist';
import updateTask from "../../utils/tasks/updateTask";
import CollapseArrow from '../../img/collapse-arrow.png';
import BlackTrash from '../../img/black-trash.svg';
import { TaskEntry } from "../../App";

type TaskEditModalProps = {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TaskEditModal({setModalIsOpen}: TaskEditModalProps) {
  const appCtx = React.useContext(AppContext);
  if (appCtx === null || appCtx.selectedTaskId === null) {
    throw new Error('appCtx is null');
  }

  // this modal is only opened when appCtx.selectedTaskId !== null, therefore non null value is enforced here
  const [task, setTask] = React.useState<TaskEntry>(appCtx.tasksObj[appCtx.selectedTaskId]);
  
  const [name, setName] = React.useState<string>("");
  
  React.useEffect(() => {
    setName(task.name);
  }, [task]);

  React.useEffect(() => {
    if (appCtx !== null && appCtx.selectedTaskId !== null) {
      console.log('herewego');
      setTask(appCtx.tasksObj[appCtx.selectedTaskId]);
    }
  }, [appCtx.selectedTaskId, appCtx.tasksObj]);

  function dispatchTaskDelete() {
    if (appCtx !== null) {
      deleteTask(appCtx, (task as TaskEntry).id as string | number).then(() => setModalIsOpen(false));
    }
  }

  function getCreatedOnString(createdOn: Date | string) {
    const date = new Date(createdOn);
    return date.toDateString();
  }

  type updateTaskPropsParams = {
    name?: string,
    description?: string,
    isCompleted?: boolean,
  }
  function updateTaskProps(alteredTaskFields: updateTaskPropsParams) {
    if (appCtx !== null && appCtx.selectedTaskId !== null) {
      const oldTask = appCtx.tasksObj[appCtx.selectedTaskId];
      const alteredTask = {...oldTask, ...alteredTaskFields};
      updateTask(appCtx, appCtx.selectedTaskId, alteredTask);
    }
  }

  return (
    <div style={{backgroundColor: '#FCD620', width: '425px'}} className={'flex flex-col justify-between'}>
      <div className={'m-2.5'}>
        <div className={'mb-3'}>
          <div style={{border: '1px solid #E8E8E8'}} className={'h-14 w-full bg-white flex flex-row justify-start items-center'}>
            <input type="checkbox" name="task status" className={'mr-7'} checked={(task as TaskEntry).isCompleted} 
              onChange={(_event) => {changeTaskStatus(appCtx, (task as TaskEntry).id as string | number)}}
            />
            <input 
              type={'text'} value={name as string} 
              onChange={(e) => setName(e.target.value)} 
              onBlur={(e) => updateTaskProps({name: e.target.value})} 
              className={'text-xl font-normal'} 
            />
          </div>
        </div>
        <textarea 
          className={'p-4 h-72 w-full'} 
          onBlur={(e) => updateTaskProps({description: e.target.value})} 
          placeholder={'Description'} 
          defaultValue={(task as TaskEntry).description} 
        />
      </div>
      <div className={'py-5 flex flex-row justify-evenly border-solid border-t-2 border-gray-200'}>
        <img src={CollapseArrow} className={'transform rotate-180'} alt={""} />
        <span>Created on {getCreatedOnString((task as TaskEntry).createdOn)}</span>
        <button onClick={dispatchTaskDelete}>
          <img src={BlackTrash} alt={'delete task'} />
        </button>
      </div>
    </div>
  )
}