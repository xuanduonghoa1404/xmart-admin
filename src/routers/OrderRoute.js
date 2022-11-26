import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import OrderManager from "../components/Order/OrderManager";
import AddOrder from "../components/Order/AddOrder";
function OrderRoute(props) {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route path={path}>
        <OrderManager />
      </Route>
      <Route path={`${path}/id`}>
        <AddOrder />
      </Route>
    </Switch>
  );
}

export default OrderRoute;
