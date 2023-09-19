import React from "react"
import {Link, Navigation} from "react-router-dom"

const Nav = ()=>{
    return (
        <div className="navigation">
            <div className="logo">
                <img src="" alt="Logo"/>
            </div>
            <div className="links">
                <Link to="/About" id="about">About</Link>
                <Link to="/Login"id="login">Login</Link>
                <Link to="/SignUp" id="signup" className="signup">Sign Up</Link>
            </div>
        </div>
    )
}

export default Nav