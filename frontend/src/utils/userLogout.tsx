import {GlobalContext} from "../App";

export default function userLogout(appCtx: GlobalContext) {
  appCtx.setJwtToken("");
}