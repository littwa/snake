import "./App.css";
// import React, { Component } from "react";
import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";

import Main from "./Comonents/Main";

// function App() {
//   return <Main />;
// }

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/score" component={() => <div>Score</div>} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
