import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { StoreProvider } from "./Store";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ParallaxProvider } from "react-scroll-parallax";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <PayPalScriptProvider deferLoading={true}>
          <ParallaxProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ParallaxProvider>
        </PayPalScriptProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);
