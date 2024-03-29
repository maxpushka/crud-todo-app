import React from "react";
import { AppContext, GlobalContext, TaskEntry } from "../App";
import './Todolist.css';
import PlusSign from '../img/plus.svg';
import getTasks from "../utils/tasks/getTasks";
import createTask from "../utils/tasks/createTask";
import updateTask from "../utils/tasks/updateTask";
import RenameModal from "./modals/RenameModal";
import ListOptionsModal from "./modals/ListOptionsModal";
import TaskEditModal from "./modals/TaskEditModal";

export function changeTaskStatus(appCtx: GlobalContext, taskId: string | number) {
  const oldTask = appCtx.tasksObj[taskId];
  const alteredTask = {
    name: oldTask.name,
    description: oldTask.description,
    isCompleted: !oldTask.isCompleted
  };

  updateTask(appCtx, taskId, alteredTask);
}

export default function Todolist() {
  const appCtx = React.useContext(AppContext);
  if (appCtx === null) {
    throw new Error('appCtx is null');
  }

  const [taskEditModalIsOpen, setTaskEditModalIsOpen] = React.useState<boolean>(false);
  const [listOptionsModalIsOpen, setListOptionsModalIsOpen] = React.useState<boolean>(false);
  const [renameModalIsOpen, setRenameModalIsOpen] = React.useState<boolean>(false);

  const [taskComponents, setTaskComponents] = React.useState<JSX.Element[]>([]);

  React.useEffect(() => {
    setTaskEditModalIsOpen(false);
    getTasks(appCtx);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appCtx.selectedListId]);

  React.useEffect(() => {
    const newListButton = (key: React.Key, task: TaskEntry) => {
      const ctx = appCtx as GlobalContext;
      return (
        <div key={key} onClick={() => {ctx.setSelectedTaskId(task.id); setTaskEditModalIsOpen(true)}}>
          <input type="checkbox" name="task status" className={'mr-7'}
            checked={task.isCompleted} onChange={(event) => {changeTaskStatus(ctx, task.id as string | number)}}
          />
          <span className={task.isCompleted ? 'line-through' : ''}>
            {task.name}
          </span>
        </div>
      )
    }

    const arr: JSX.Element[] = [];
    let key = 0;
    for (let [, taskEntry] of Object.entries(appCtx.tasksObj)) {
      arr.push(newListButton(key++, taskEntry));
    }
    setTaskComponents(arr);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appCtx.tasksObj]);

  return (
    <>
      {
        appCtx.selectedListId === null ? 
          (<div className={'h-full flex flex-col justify-center items-center'}>
             <p style={{color: '#FCD620'}} className={"text-xl font-semibold"}>List not found</p>
             <p>We can't find the list you're looking for. Select one of your lists from the sidebar or create a new list.</p>
           </div> ) :
          (
            <div className={'flex flex-row h-full'}>
              <div className={'w-full ml-4 mt-5'}>
                <div>
                  <span className={'mr-2 text-xl text-black font-semibold'}>{appCtx.listsObj[appCtx.selectedListId].name}</span>
                  <button type={'button'} onClick={() => setListOptionsModalIsOpen(!listOptionsModalIsOpen)}>•••</button>
                  <button onClick={() => createTask(appCtx)}
                      className={'mt-5 flex flex-row justify-start items-center border-solid border-b-2 border-gray-200'}>
                    <img src={PlusSign} alt="" style={{width: '15.33px', height: '15.33px'}} className={'mr-3'}/>
                    <span className={'text-black'}>Add a task</span>
                  </button>
                  {taskComponents}
                </div>
              </div>

              {taskEditModalIsOpen ? <TaskEditModal setModalIsOpen={setTaskEditModalIsOpen} /> : null}
            </div>
          )
      }

      {listOptionsModalIsOpen ? (
        <ListOptionsModal 
          setListOptionsModalIsOpen={setListOptionsModalIsOpen} 
          setRenameModalIsOpen={setRenameModalIsOpen} 
        />) : null}
      {renameModalIsOpen ? <RenameModal setRenameModalIsOpen={setRenameModalIsOpen} /> : null}
    </>
  )
}
