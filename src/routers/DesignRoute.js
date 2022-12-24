import Home from "../components/Home/Home";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Design from "../components/Marketing/Design";

function DesignRoute(props) {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route path={path}>
        <Design />
      </Route>
    </Switch>
  );
}

export default DesignRoute;
