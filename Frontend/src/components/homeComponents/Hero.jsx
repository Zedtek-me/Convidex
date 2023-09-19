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
                <p className="catch-phrase">
                    Business teams collaborate easily when there's a reliable means of communication.
                    Convidex brings such ease of communication for you and your team members...
                </p>
                <div className="btn-singups">
                    <button type="button" className="new-meeting">
                        Create new meeting
                    </button>
                    <button type="button" className="join-meeting">
                        Join an ongoing meeting
                    </button>
                </div>
            </div>
            <div className="sample-img">
                <img src={heroImage} alt="sample image by right" id="sample-img"/>
            </div>
        </div>
    )
}

export default Hero