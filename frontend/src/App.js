import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import * as groupActions from './store/groups';
import * as eventActions from './store/events';
import Navigation from "./components/Navigation";
import HomePage from "./components/Home";
import Groups from "./components/Groups";
import SingleGroup from "./components/SingleGroup";
import GroupForm from "./components/Groups/NewGroup";
import UpdateGroup from "./components/Groups/UpdateGroup";
import Events from "./components/Events";
import SingleEvent from "./components/SingleEvent";
import EventForm from "./components/NewEvent";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(groupActions.getAllGroups())
    dispatch(eventActions.getAllEvents())
  }, [dispatch]);

  const groups = useSelector(state => state.groups.groups.allGroups)
  // console.log(groups)
  const events = useSelector(state=> state.events.Events.allEvents)
  // console.log(events)
  if (!Object.values(groups).length || !Object.values(events).length) {
    // console.log('-------------group obj bad---------')
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
          <Route path='/groups/:groupid/events/new' exact>
            <EventForm />
          </Route>

          <Route path='/events' exact>
            <Events />
          </Route>
          <Route path='/events/:eventId' exact>
            <SingleEvent />
          </Route>
        </Switch>
      )}

    </>
  );
}

export default App;
