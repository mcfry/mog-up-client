import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Global CSS - TailwindCSS enabled
import "./index.css";

// Utils
import * as serviceWorker from "./serviceWorker";
import reportWebVitals from "./reportWebVitals";

// Routes
import Routes from "./routes/Routes";

// https://www.apollographql.com/docs/react/v2/data/error-handling/
const client = new ApolloClient({
  uri: process.env.REACT_APP_SERVER_URL,
  cache: new InMemoryCache(),
});

{
  /* <React.StrictMode>
</React.StrictMode> */
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// import { ApolloClient } from 'apollo-client'
// import { InMemoryCache } from "apollo-cache-inmemory"
// // eslint-disable-next-line
// import { ApolloLink } from 'apollo-link'
// import { onError } from 'apollo-link-error'
// import { createHttpLink } from 'apollo-link-http'
// import { ApolloProvider } from 'react-apollo'

// const cache = new InMemoryCache()

// const errorLink = onError(({ graphQLErrors, networkError }) => {
// 	if (graphQLErrors)
// 		graphQLErrors.map(({ message, locations, path }) =>
// 			console.log(
// 				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
// 			),
// 	)

// 	if (networkError)
// 		console.log(`[Network error]: ${networkError}`)
// })
// const link = ApolloLink.from([
//   errorLink,
//   createHttpLink({ uri: 'http://localhost:4000' })
// ])

// const client = new ApolloClient({
// 	cache,
// 	link
// })

// "apollo-cache-inmemory": "^1.6.6",
//     "apollo-client": "^2.6.10",
//     "apollo-link": "^1.2.14",
//     "apollo-link-error": "^1.1.13",
//     "apollo-link-http": "^1.5.17",
//    "react-apollo": "^3.1.5",
