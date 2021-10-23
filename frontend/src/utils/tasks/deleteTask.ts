import getTasks from "./getTasks";
import {GlobalContext} from "../../App";

export default async function deleteTask(appCtx: GlobalContext, taskId: string | number) {
  if (appCtx.selectedListId !== null) {
    const tasks = await fetch(`/todo/lists/${appCtx.selectedListId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': `Bearer ${appCtx.jwtToken}`
      })
    }).then(data => data.text());

    switch (tasks) {
      case 'cannot extract list id':
      case 'cannot extract task id':
      case 'requested list does not exits':
      case 'requested task does not exits':
        break;
      case 'deleted':
      default:
        getTasks(appCtx);
    }
  }
}