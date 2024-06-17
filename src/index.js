import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";

import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "./context/ThemeContext";
import WalletProvider from "./components/providers/WalletProvider";
import { store } from "./redux/store";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.render(
	<Provider store={store}>
		<ThemeProvider>
			<WalletProvider>
				<App />
			</WalletProvider>
		</ThemeProvider>
	</Provider>,
	document.getElementById("root")
);

reportWebVitals();
