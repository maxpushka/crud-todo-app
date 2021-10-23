import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { AppContext, GlobalContext } from '../App';

type ProtectedRouteProps = {
  redirectTo: string;
} & RouteProps;

export default function ProtectedRoute({redirectTo, ...routeProps}: ProtectedRouteProps) {
  const appCtx = React.useContext(AppContext) as GlobalContext;

  if (appCtx.jwtToken !== "") {
    return <Route {...routeProps} />;
  }
  else {
    return <Redirect to={{ pathname: redirectTo }} />;
  }
}
