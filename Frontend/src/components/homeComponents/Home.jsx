import React from "react"
import Nav from "./Nav.jsx"
import "./Home.css"
import Body from "./Body.jsx"
import Hero from "./Hero.jsx"
import Footer from "./Footer.jsx"
import { useNavigate } from "react-router-dom"

export const Home = ()=>{
    let meetingNavigation = useNavigate()
    const navigateMeeting = (e)=>{
        let btn = e.target
        if(btn.name == "create-meeting"){
            return meetingNavigation("/create-meeting")
        }
        return meetingNavigation("/join-meeting")
    }
    return (
        <div className="home-page">
            {/* The home page should have both the create and join meeting options */}
            <Nav/>
            <Body>
                <Hero navigateMeeting={navigateMeeting}/>
                <Footer/>
            </Body>
        </div>
    )
}