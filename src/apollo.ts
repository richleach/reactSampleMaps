import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { useMemo } from "react";

function createApolloClient() {
    return new ApolloClient({
        link: new HttpLink({uri: "/api/graphql", credentials: "same-origin"}),
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: "cache-and-network"
            }
        }
    })
}

//custom hook
export function useApollo() {
    const client = useMemo(() => createApolloClient(), [])  //"caching" via useMemo, works like useEffect
    return client
}