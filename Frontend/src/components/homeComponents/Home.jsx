import React from "react"
import Nav from "./Nav.jsx"
import "./Home.css"

export const Home = ()=>{
    return (
        <div className="home-page">
            {/* The home page should have both the create and join meeting options */}
            <Nav/>
        </div>
    )
}