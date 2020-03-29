import * as React from "react";
import { useEffect, useState } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { postFile } from "../util";

import Dropzone from "./dropzone";
import Login from "./login";
import DashPlayer from "./dash_player";
import Header from "./header";
import VideoStream from "./video_stream";

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
                <Dropzone size={[300, 300]} onFileDropped={(file) => postFile("/upload", file, () => {})} />
              </Route>
              <Route path="/video">
                <DashPlayer width={700} manifest="https://d376bim64wsdac.cloudfront.net/transcoded/3ac8ef6c-5fea-424b-85c2-8caee29f6439.mpd" />
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
