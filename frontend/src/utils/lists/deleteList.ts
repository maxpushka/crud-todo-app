import getLists from './getLists';
import {GlobalContext} from "../../App";

type DeleteListProps = {
  appCtx: GlobalContext,
  listId: string | number | null
}

export default async function deleteList({appCtx, listId}: DeleteListProps) {
  const response = await fetch(`/todo/lists/${listId}`, {
    method: 'DELETE',
    headers: new Headers({'Authorization': `Bearer ${appCtx.jwtToken}`})
  }).then(data => data.text());

  switch (response) {
    case 'cannot extract list id':
    case 'requested list does not exits':
      break;
    case 'deleted':
    default:
      appCtx.setSelectedListId(null);
      getLists(appCtx);
  }
}