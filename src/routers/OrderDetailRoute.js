import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import OrderManager from "../components/Order/OrderManager";
import EditOrder from "../components/Order/EditOrder";
function OrderDetailRoute(props) {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route
        path={`${path}`}
        render={(props) => <EditOrder {...props} />}
      ></Route>
    </Switch>
  );
}

export default OrderDetailRoute;
