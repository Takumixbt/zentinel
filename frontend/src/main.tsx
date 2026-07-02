import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Web3Provider } from "./providers/Web3Provider";
import { FhevmProvider } from "./providers/FhevmProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Web3Provider>
      <FhevmProvider>
        <App />
      </FhevmProvider>
    </Web3Provider>
  </StrictMode>,
);
