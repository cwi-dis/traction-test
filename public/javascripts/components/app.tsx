import * as React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { postFile } from "../util";

import Dropzone from "./dropzone";

interface AppProps {
}

const App: React.FC<AppProps> = () => {
  return (
    <Router>
      <Switch>
        <Route path="/upload">
          <Dropzone onFileDropped={(file) => postFile("/upload", file)} />
        </Route>
        <Route path="/">
          <div>Hello World</div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
