import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import EditLocator from "../components/Store/EditLocator";
function EditLocatorRoute(props) {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route
        path={`${path}`}
        render={(props) => <EditLocator {...props} />}
      ></Route>
    </Switch>
  );
}

export default EditLocatorRoute;
