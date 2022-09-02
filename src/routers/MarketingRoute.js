import Home from "../components/Home/Home";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import MarketingManager from "../components/Marketing/MarketingManager";

function MarketingRoute(props) {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route path={path}>
        <MarketingManager />
      </Route>
    </Switch>
  );
}

export default MarketingRoute;
