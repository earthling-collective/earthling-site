import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { TransitionParent } from "../Transtitions";
import ComingSoon from "../../routes/ComingSoon";

export default () => {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Route>
          {({ location }) => (
            <TransitionParent>
              <Switch location={location}>
                <Route path="/">
                  <ComingSoon />
                </Route>
              </Switch>
            </TransitionParent>
          )}
        </Route>
      </Suspense>
    </BrowserRouter>
  );
};
