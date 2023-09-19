import React, {creaetContext, useState, useEffect, useRef} from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import { useQuery, useMutation, gql } from "@apollo/client"
import {Home} from "../components/homeComponents/Home.jsx"

import "./App.css"

const cache = new InMemoryCache()
const apiClient = new ApolloClient({
    url:"",
    cache:cache
})

export default function App(props){
    // parent component rendering all other componenents.
    return (
        <div className="App">
            <ApolloProvider client={apiClient}>
                <Router>
                    <Routes>
                        <Route path="/">
                            <Route path="home" element={<Home/>}/>
                        </Route>
                    </Routes>
                </Router>
            </ApolloProvider>
            <div className="other-links">Linked Contents</div>
        </div>
    )
}