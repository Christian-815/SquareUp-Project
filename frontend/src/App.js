import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import * as groupActions from './store/groups';
import Navigation from "./components/Navigation";
import HomePage from "./components/Home";
import Groups from "./components/Groups";
import SingleGroup from "./components/SingleGroup";
import GroupForm from "./components/Groups/NewGroup";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(groupActions.getAllGroups())
  }, [dispatch]);

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
        </Switch>
      )}

    </>
  );
}

export default App;
