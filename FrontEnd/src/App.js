import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import LogIn from "./LogIn"
import SignUp from "./SignUp"
import Chat from "./Chat"







function App() {

 

  return (
    

    <Router>
      <Switch>
          <Route path="/login">
            <LogIn/>
          </Route>
          <Route path="/signUp">
          <SignUp />
          </Route>
          <Route path="/messages">
          <Chat />
          </Route>
          <Route path="/">
          <LogIn />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
