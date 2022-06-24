import Home from "../components/Home/Home";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ImportInventory from "../components/Inventory/ImportInventory";

function ExportInventoryRoute(props) {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route path={path}>
        <ImportInventory />
      </Route>
    </Switch>
  );
}

export default ExportInventoryRoute;
