import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ComingSoon from "../../routes/ComingSoon";
import BlogPost from "../../routes/BlogPost";

export default () => {
  return (
    <BrowserRouter>
      <Route>
        {({ location }) => (
          <Switch location={location} key={location.pathname}>
            <Route exact path="/blog">
              <BlogPost />
            </Route>
            <Route path="/">
              <ComingSoon />
            </Route>
          </Switch>
        )}
      </Route>
    </BrowserRouter>
  );
};
