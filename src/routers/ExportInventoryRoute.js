import Home from "../components/Home/Home";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ExportInventory from "../components/Inventory/ExportInventory";

function ImportInventoryRoute(props) {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route path={path}>
        <ExportInventory />
      </Route>
    </Switch>
  );
}

export default ImportInventoryRoute;
