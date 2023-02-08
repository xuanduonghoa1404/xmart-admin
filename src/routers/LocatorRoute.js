import Home from "../components/Home/Home";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import LocatorManager from "../components/Store/LocatorManager";

function TableRoute(props) {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route path={path}>
        <LocatorManager />
      </Route>
    </Switch>
  );
}

export default TableRoute;
