import React, {creaetContext, useState, useEffect, useRef} from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import { useQuery, useMutation, gql } from "@apollo/client"
import {Home} from "../components/Home.jsx"

const cache = new InMemoryCache()
const apiClient = new ApolloClient({
    url:"",
    cache:cache
})

export default function App(props){
    // parent component rendering all other componenents.
    return (
        <>
            <ApolloProvider client={apiClient}>
                {/* location history api creator */}
                <Router>
                    {/* checks current browser location against each routes */}
                    <Routes>
                        <Route path="/">
                            <Route path="home" element={<Home></Home>}/>
                        </Route>
                    </Routes>
                </Router>
            </ApolloProvider>
        </>
    )
}