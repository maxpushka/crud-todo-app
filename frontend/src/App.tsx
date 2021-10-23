import React from 'react'
import { Switch, Route, Redirect } from 'react-router';
import ProtectedRoute from './utils/ProtectedRoute';
import AuthForm from './components/AuthForm';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Todolist from './components/Todolist';
import './App.css';

export const AppCtx = React.createContext<GlobalContext|null>(null);

export type List = {
  name: string,
}

export type Task = {
  id: string | number | null,
  name: string,
  description: string,
  isCompleted: boolean,
  createdOn: Date
}

export type GlobalContext = {
  jwtToken: string | null, 
  setJwtToken: React.Dispatch<React.SetStateAction<string | null>>, 
  userEmail: string | null,
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>, 
  listsObj: object | null, 
  setListsObj: React.Dispatch<React.SetStateAction<object | null>>,
  tasksObj: object | null, 
  setTasksObj: React.Dispatch<React.SetStateAction<object | null>>,
  selectedListId: string | number | null, 
  setSelectedListId: React.Dispatch<React.SetStateAction<string | number | null>>,
  selectedTaskId: string | number | null, 
  setSelectedTaskId: React.Dispatch<React.SetStateAction<string | number | null>>
};

export default function App() {
  const [jwtToken, setJwtToken] = React.useState<string | null>("");
  const [userEmail, setUserEmail] = React.useState<string | null>("");

  const [selectedListId, setSelectedListId] = React.useState<string | number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | number | null>(null);

  const [listsObj, setListsObj] = React.useState<object | null>({});
  const [tasksObj, setTasksObj] = React.useState<object | null>({});

  React.useEffect(() => {
    console.log('received new jwt', jwtToken);
  }, [jwtToken]);

  React.useEffect(() => {
    console.log('selected list id', selectedListId);
  }, [selectedListId]);

  React.useEffect(() => {
    console.log('selected task id', selectedTaskId);
  }, [selectedTaskId]);

  return (
    <AppCtx.Provider value={{ 
          jwtToken, setJwtToken, 
          userEmail, setUserEmail, 
          listsObj, setListsObj,
          tasksObj, setTasksObj,
          selectedListId, setSelectedListId,
          selectedTaskId, setSelectedTaskId,
        }}>
      <Switch>
        <Route path={'/login'}>
          {jwtToken !== "" ? <Redirect to='/' /> : null}
          <AuthForm />
        </Route>
        <ProtectedRoute redirectTo={'/login'} exact path={'/'}>
          <div className={'flex flex-row'}>
            <Sidebar />
            <div className={'flex flex-col w-full'}>
              <Topbar />
              <Todolist />
            </div>
          </div>
        </ProtectedRoute>
      </Switch>
    </AppCtx.Provider>
  );
}
