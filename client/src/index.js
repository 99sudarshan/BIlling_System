import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "./assets/css/tailwind.css";
import "./assets/css/loder.css";
import "./assets/css/print.css";
import "react-toastify/dist/ReactToastify.css";

import reportWebVitals from "./reportWebVitals";
import PageLoading from "./components/common/PageLoading";
const WebAndDashboardManager = React.lazy(() =>
  import("./components/WebAndDashboardManager")
);

store.subscribe(() => store.getState());
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <WebAndDashboardManager />
      </Suspense>
    </BrowserRouter>
  </Provider>
);
reportWebVitals();
