import getTasks from "./getTasks";
import {GlobalContext} from "../../App";

export type NewTaskObject = {
  name: string,
  description: string,
  isCompleted: boolean
}

export default async function updateTask(appCtx: GlobalContext, taskId: number | string, newTaskObj: NewTaskObject) {
  const response = await fetch(`/todo/lists/${appCtx.selectedListId}/tasks/${taskId}`, {
    method: 'PUT',
    headers: new Headers({
      'Authorization': `Bearer ${appCtx.jwtToken}`
    }),
    body: JSON.stringify({
      name: newTaskObj.name,
      description: newTaskObj.description,
      isCompleted: newTaskObj.isCompleted
    })
  }).then(data => data.text());

  switch (response) {
    case 'cannot extract list id':
    case 'cannot extract task id':
    case 'requested list does not exits':
    case 'requested task does not exits':
    case 'could not read params':
      break;
    case 'updated':
    default:
      getTasks(appCtx);
  }
}