import * as React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

interface AppProps {
}

const App: React.FC<AppProps> = () => {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <div>Hello World</div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
