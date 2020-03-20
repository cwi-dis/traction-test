import { createElement } from "react";
import { render } from "react-dom";

import App from "./components/app";

import "bulma/css/bulma.css";
import "../stylesheets/style.css";

/**
 * Callback triggered when the window is loaded. Renders the application to the
 * DOM and attaches it to the `react` DOM node.
 */
window.onload = () => {
  // Render app and attach it to div 'react'
  render(
    createElement(App),
    document.getElementById("react")
  );
};
