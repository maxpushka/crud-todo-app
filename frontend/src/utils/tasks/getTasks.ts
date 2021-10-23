import {GlobalContext} from "../../App";

export default async function getTasks(appCtx: GlobalContext) {
  if (appCtx.selectedListId !== null) {
    const tasks = await fetch(`/todo/lists/${appCtx.selectedListId}/tasks`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${appCtx.jwtToken}`
      })
    }).then(data => data.text());

    switch (tasks) {
      case 'cannot extract list id':
      case 'requested list does not exits':
        break;
      default:
        appCtx.setTasksObj(JSON.parse(tasks));
    }
  }
}