import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import { MemoryRouter } from 'react-router-dom';

ReactDOM.render(
 <MemoryRouter>
    <App />
  </MemoryRouter>
    , document.getElementById("root"));