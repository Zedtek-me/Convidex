import React from "react"
import heroImage from "../../../public/assets/images/africanManConf.jpg"
const Hero = ()=>{
    return (
        <div className="hero">
            <div className="introduction">
                <h3 className="introductory-text">
                    Welcome to Convidex --
                    the advanced video confrencing application built for businesses like yours.
                </h3>
            </div>
            <div className="sample-img">
                <img src={heroImage} alt="sample image by right" id="sample-img"/>
            </div>
        </div>
    )
}

export default Hero