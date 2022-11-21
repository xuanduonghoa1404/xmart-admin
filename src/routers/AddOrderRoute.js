import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import AddOrder from "../components/Order/AddOrder";

function AddOrderRoute(props) {
  const { path, url } = useRouteMatch("/order/:id");
  console.log(" path, url,",  path, url)
  return (
    <Switch>
      <Route path={`${path}/:id`}>
        <AddOrder />
      </Route>
    </Switch>
  );
}

export default AddOrderRoute;
