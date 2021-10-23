import getLists from "./getLists";
import {GlobalContext} from "../../App";

export type CreateListProps = {
  appCtx: GlobalContext,
  listName: string
}

export default async function createList({appCtx, listName}: CreateListProps) {
  const newListId = await fetch('/todo/lists', {
    method: 'POST',
    headers: new Headers({
      'Authorization': `Bearer ${appCtx.jwtToken}`
    }),
    body: JSON.stringify({name: listName})
  }).then(data => data.text());

  switch (newListId) {
    case 'could not read params':
      break;
    default:
      getLists(appCtx);
  }
}