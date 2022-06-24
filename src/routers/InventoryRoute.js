import Home from "../components/Home/Home";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import InventoryManager from "../components/Inventory/InventoryManager";

function InventoryRoute(props) {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route path={path}>
        <InventoryManager />
      </Route>
    </Switch>
  );
}

export default InventoryRoute;
