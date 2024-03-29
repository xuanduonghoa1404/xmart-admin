// import Loading from "components/common/Loading";
import PrivateRoute from "../components/Shared/PrivateRoute";

import React, { Suspense, lazy } from "react";

import { Route, Switch, useLocation } from "react-router-dom";

// import ErrorNotFound from '../components/common/ErrorNotFound';

import LayoutMenu from "../components/Layout/LayoutMenu";
import { Card } from "antd";

const Home = lazy(() => import("./HomeRoute"));
const OrderManager = lazy(() => import("./OrderRoute"));
const OrderDetailManager = lazy(() => import("./OrderDetailRoute"));
const OrderAddManager = lazy(() => import("./OrderAddRoute"));
const ProductManager = lazy(() => import("./ProductRoute"));
const TypeProductManager = lazy(() => import("./TypeProductRoute"));
const MarketingManager = lazy(() => import("./MarketingRoute"));
const DesignManager = lazy(() => import("./DesignRoute"));
const InventoryManager = lazy(() => import("./InventoryRoute"));
const ImportInventory = lazy(() => import("./ImportInventoryRoute"));
const ExportInventory = lazy(() => import("./ExportInventoryRoute"));
const LocatorManager = lazy(() => import("./LocatorRoute"));
const EditLocator = lazy(() => import("./EditLocatorRoute"));
const ShopManager = lazy(() => import("./ShopRoute"));
const MemberManager = lazy(() => import("./MemberRoute"));
const AccountManager = lazy(() => import("./AccountRoute"));
// const Profile = lazy( () => import("routers/ProfileRoute"));
// const Test = lazy( () => import("components/Test"));

function MainAppRoute(props) {
  return (
    <LayoutMenu>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <PrivateRoute component={Home} exact path="/" />
          <PrivateRoute component={OrderManager} exact path="/order" />
          <PrivateRoute component={OrderAddManager} exact path="/add-order" />
          <PrivateRoute
            component={OrderDetailManager}
            exact
            path="/order/:id"
            render={(props) => <OrderDetailManager {...props} />}
          />
          <PrivateRoute
            component={EditLocator}
            exact
            path="/store/locator/:id"
            render={(props) => <EditLocator {...props} />}
          />
          <PrivateRoute component={ProductManager} exact path="/product" />
          <PrivateRoute
            component={TypeProductManager}
            exact
            path="/typeproduct"
          />
          <PrivateRoute component={DesignManager} exact path="/design" />
          <PrivateRoute component={MarketingManager} exact path="/marketing" />
          <PrivateRoute component={InventoryManager} exact path="/inventory" />
          <PrivateRoute component={ImportInventory} path="/inventory/import" />
          <PrivateRoute component={ExportInventory} path="/inventory/export" />
          <PrivateRoute
            component={LocatorManager}
            exact
            path="/store/locator"
          />
          <PrivateRoute component={ShopManager} exact path="/store/shop" />
          <PrivateRoute component={MemberManager} exact path="/member" />
          <PrivateRoute component={AccountManager} exact path="/account" />

          {/* <Route component={ErrorNotFound} path="*" /> */}
        </Switch>
      </Suspense>
    </LayoutMenu>
  );
}

export default MainAppRoute;
