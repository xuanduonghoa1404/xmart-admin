import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import AddOrder from "../components/Order/AddOrder";
function OrderDetailRoute(props) {
  const { path, url } = useRouteMatch();
  console.log(" path, url,111111", path, url);
  return (
    <Switch>
      <Route path={`${path}`}>
        <AddOrder />
      </Route>
    </Switch>
  );
}

export default OrderDetailRoute;
