import React from "react"


const JoinMeeting = ()=>{

    return (
        <div className="join-meeting-form">
            <h4 id="join-text">Join Meeting</h4>
            <hr id="divider" />
            <form>
                <label htmlFor="meeting-title">
                    <p className="meeting-title" id="field-identifier">Title</p>
                    <input type="text" placeholder="meeting title"/>
                </label>
                <label htmlFor="meeting-link">
                    <p className="meeting-link" id="field-identifier">Link</p>
                    <input type="text" placeholder="meeting link? optional"/>
                </label>
                <label htmlFor="meeting-password">
                    <p className="meeting-pass" id="field-identifier">Password</p>
                    <input type="password" placeholder="meeting password"/>
                </label>
                <button type="submit" className="enter-meeting">Join</button>
            </form>
        </div>
    )
}


export default JoinMeeting