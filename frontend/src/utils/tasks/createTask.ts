import getTasks from "./getTasks";
import {GlobalContext} from "../../App";

export default async function createTask(appCtx: GlobalContext) {
  const newTaskId = await fetch(`/todo/lists/${appCtx.selectedListId}/tasks`, {
    method: 'POST',
    headers: new Headers({
      'Authorization': `Bearer ${appCtx.jwtToken}`
    }),
    body: JSON.stringify({
      name: "New task",
      description: "",
    })
  }).then(data => data.text());

  switch (newTaskId) {
    case 'cannot extract list id':
    case 'requested list does not exits':
    case 'could not read params':
      break;
    default:
      getTasks(appCtx);
  }
}