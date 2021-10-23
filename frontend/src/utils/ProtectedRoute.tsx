import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { AppCtx } from '../App';

type ProtectedRouteProps = {
  redirectTo: string;
} & RouteProps;

export default function ProtectedRoute({redirectTo, ...routeProps}: ProtectedRouteProps) {
  const {jwtToken} = React.useContext(AppCtx);

  if (jwtToken !== "") {
    return <Route {...routeProps} />;
  }
  else {
    return <Redirect to={{ pathname: redirectTo }} />;
  }
}
