import * as React from "react";
import { useEffect, useState } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./login";
import Video from "./video";
import Header from "./header";
import VideoStream from "./video_stream";
import VideoUpload from "./video_upload";

interface AppProps {
}

const App: React.FC<AppProps> = () => {
  const [loginStatus, setLoginStatus] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const res = await fetch("/loginstatus", { method: "GET" })

      if (res.ok) {
        const data = await res.json();
        setLoginStatus(data.status);
      }
    })();
  });

  const renderRouter = () => {
    return (
      <Router>
        <Header />

        <div className="columns" style={{ marginTop: 15 }}>
          <div className="column is-8 is-offset-2">
            <Switch>
              <Route path="/upload">
                <VideoUpload />
              </Route>
              <Route path="/video/:id">
                <Video />
              </Route>
              <Route path="/">
                <VideoStream />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  };

  return (
    (loginStatus) ? renderRouter() : <Login loginSuccess={() => location.href = "/"} />
  );
}

export default App;
