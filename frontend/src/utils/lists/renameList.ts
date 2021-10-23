import getLists from "./getLists";
import {GlobalContext} from "../../App";

type CreateListProps = {
  appCtx: GlobalContext,
  newName: string | number | null
}

// Renames currently selected list
export default async function renameList({appCtx, newName}: CreateListProps) {
  const response = await fetch(`/todo/lists/${appCtx.selectedListId}`, {
    method: 'PUT',
    headers: new Headers({'Authorization': `Bearer ${appCtx.jwtToken}`}),
    body: JSON.stringify({'name': newName})
  }).then(data => data.text());

  switch (response) {
    case 'could not read params':
    case 'cannot extract list id':
    case 'requested list does not exits':
      break;
    default:
      getLists(appCtx);
  }
}