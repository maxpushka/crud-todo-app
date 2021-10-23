import {GlobalContext} from "../../App";

export default async function getLists(appCtx: GlobalContext) {
  const response = await fetch('/todo/lists', {
    method: 'GET',
    headers: new Headers({'Authorization': `Bearer ${appCtx.jwtToken}`})
  }).then(data => data.json());

  appCtx.setListsObj(response);
}