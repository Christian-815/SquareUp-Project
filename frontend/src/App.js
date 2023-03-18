import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import * as groupActions from './store/groups';
import Navigation from "./components/Navigation";
import HomePage from "./components/Home";
import Groups from "./components/Groups";
import SingleGroup from "./components/SingleGroup";
import GroupForm from "./components/Groups/NewGroup";
import UpdateGroup from "./components/Groups/UpdateGroup";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(groupActions.getAllGroups())
  }, [dispatch]);

  const groups = useSelector(state => state.groups.groups.allGroups)
  // console.log(groups)
  if (!Object.values(groups).length) {
    // console.log('-------------group obj bad---------', groupObj)
    return null;
  }

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path='/' exact>
            <HomePage />
          </Route>
          <Route path='/groups' exact>
            <Groups />
          </Route>
          <Route path='/groups/new' exact>
            <GroupForm />
          </Route>
          <Route path='/groups/:groupId' exact>
            <SingleGroup />
          </Route>
          <Route path='/groups/:groupId/edit' exact>
            <UpdateGroup groups={groups}/>
          </Route>
        </Switch>
      )}

    </>
  );
}

export default App;
