import Shop from "../components/Store/Shop";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

function ShopRoute(props) {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route path={path}>
        <Shop />
      </Route>
    </Switch>
  );
}

export default ShopRoute;