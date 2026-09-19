import React, { Suspense } from "react";
import "./App.scss";
import Router from "./components/Router";
import Cursor from "./components/Cursor";
import { TransitionParent, TransitionChild } from "./components/Transtitions";

const App = () => {
  return (
    <Cursor>
      <TransitionParent>
        <Suspense
          fallback={
            <TransitionChild
              key="loading"
              type={["fade", "up"]}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Loading
            </TransitionChild>
          }
        >
          <Router />
        </Suspense>
      </TransitionParent>
    </Cursor>
  );
}

export default App;
