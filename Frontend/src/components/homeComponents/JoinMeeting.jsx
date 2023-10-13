import React, {useState, useEffect} from "react"
import { handleMeetingResponse, handleSubmitForm, handleMeetingInput } from "../../utilities/meetingInfoUtils"
import { useNavigate } from "react-router-dom";

const JoinMeeting = ()=>{
    let [meetingCreds, setMeetingCreds] = useState({});
    let [backendResponse, setBackendResponse] = useState(null);
    let redirect = useNavigate();
    useEffect(()=>{
        // either redirect to the meeting room or give other feedback based on joining attempts
        handleMeetingResponse(redirect, backendResponse)
    }, [redirect, backendResponse])

    return (
        <div className="join-meeting-form">
            <h4 id="join-text">Join Meeting</h4>
            <hr id="divider" />
            <form>
                <label htmlFor="meeting-title">
                    <p className="meeting-title" id="field-identifier">Title</p>
                    <input type="text" placeholder="meeting title" name="meeting-title" onChange={(e)=> handleMeetingInput(e, setMeetingCreds)}/>
                </label>
                <label htmlFor="meeting-link">
                    <p className="meeting-link" id="field-identifier">Link</p>
                    <input type="text" placeholder="meeting link? optional" name="meeting-link" onChange={(e)=> handleMeetingInput(e, setMeetingCreds)}/>
                </label>
                <label htmlFor="meeting-password">
                    <p className="meeting-pass" id="field-identifier">Password</p>
                    <input type="password" placeholder="meeting password" name="meeting-password" onChange={(e)=> handleMeetingInput(e, setMeetingCreds)}/>
                </label>
                <button type="button" className="enter-meeting" name="join-meeting" onClick={async (e)=>{
                    let data = await handleSubmitForm(e, meetingCreds)
                        setBackendResponse(data)
                    }}>
                    Join
                </button>
            </form>
        </div>
    )
}


export default JoinMeeting