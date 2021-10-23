import React from "react";
import {AppCtx} from '../../App';
import deleteTask from '../../utils/tasks/deleteTask';
import {changeTaskStatus} from '../Todolist';
import updateTask from "../../utils/tasks/updateTask";
import CollapseArrow from '../../img/collapse-arrow.png';
import BlackTrash from '../../img/black-trash.svg';
import { Task } from "../../App";

export default function TaskEditModal({setModalIsOpen}) {
  const appCtx = React.useContext(AppCtx);
  const [task, setTask] = React.useState<object | null>(appCtx.tasksObj[appCtx.selectedTaskId]);
  const [name, setName] = React.useState<string | null>((task as Task).name);

  React.useEffect(() => {
    setTask(appCtx.tasksObj[appCtx.selectedTaskId]);
  }, [appCtx.selectedTaskId, appCtx.tasksObj]);

  function dispatchTaskDelete() {
    deleteTask(appCtx, (task as Task).id).then(() => setModalIsOpen(false));
  }

  function getCreatedOnString(createdOn) {
    const date = new Date(createdOn);
    return date.toDateString();
  }

  function updateDesciption(event) {
    const newDescr = event.target.value;
    const oldTask = appCtx.tasksObj[appCtx.selectedTaskId];
    const alteredTask = {
      name: oldTask.name,
      description: newDescr,
      isCompleted: !oldTask.isCompleted
    };

    updateTask(appCtx, appCtx.selectedTaskId, alteredTask);
  }

  function updateName(event) {
    const newName = event.target.value;
    const oldTask = appCtx.tasksObj[appCtx.selectedTaskId];
    const alteredTask = {
      name: newName,
      description: oldTask.description,
      isCompleted: !oldTask.isCompleted
    };

    updateTask(appCtx, appCtx.selectedTaskId, alteredTask);
  }

  return (
    <div style={{backgroundColor: '#FCD620', width: '425px'}} className={'flex flex-col justify-between'}>
      <div className={'m-2.5'}>
        <div className={'mb-3'}>
          <div style={{border: '1px solid #E8E8E8'}} className={'h-14 w-full bg-white flex flex-row justify-start items-center'}>
            <input type="checkbox" name="task status" className={'mr-7'}
              checked={(task as Task).isCompleted} onChange={(event) => {changeTaskStatus(appCtx, (task as Task).id)}}
            />
            <input type={'text'} value={name} onChange={(e) => setName(e.target.value)} onBlur={updateName} className={'text-xl font-normal'} />
          </div>
        </div>
        <textarea className={'p-4 h-72 w-full'} onBlur={updateDesciption} placeholder={'Description'}>
          {(task as Task).description}
        </textarea>
      </div>
      <div className={'py-5 flex flex-row justify-evenly border-solid border-t-2 border-gray-200'}>
        <img src={CollapseArrow} className={'transform rotate-180'} alt={""} />
        <span>Created on {getCreatedOnString((task as Task).createdOn)}</span>
        <button onClick={dispatchTaskDelete}>
          <img src={BlackTrash} alt={'delete task'} />
        </button>
      </div>
    </div>
  )
}