import * as React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { postFile } from "../util";

import Dropzone from "./dropzone";
import Login from "./login";
import LogoutButton from "./logout_button";

interface AppProps {
}

const App: React.FC<AppProps> = () => {
  return (
    <Router>
      <Switch>
        <Route path="/upload">
          <Dropzone size={[300, 300]} onFileDropped={(file) => postFile("/upload", file)} />
        </Route>
        <Route path="/login">
          <Login loginSuccess={() => console.log("Login succeeded")} />
        </Route>
        <Route path="/logout">
          <LogoutButton logoutSuccess={() => console.log("Logout succeeded")} />
        </Route>
        <Route path="/">
          <div>Hello World</div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
