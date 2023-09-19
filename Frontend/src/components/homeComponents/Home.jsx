import React from "react"
import Nav from "./Nav.jsx"
import "./Home.css"
import Body from "./Body.jsx"
import Hero from "./Hero.jsx"
import Footer from "./Footer.jsx"

export const Home = ()=>{
    return (
        <div className="home-page">
            {/* The home page should have both the create and join meeting options */}
            <Nav/>
            <Body>
                <Hero/>
                <Footer/>
            </Body>
        </div>
    )
}