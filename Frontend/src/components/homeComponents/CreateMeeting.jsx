import React, {useState, use, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { handleMeetingInput, CREATE_MEETING , WebRtcPlugin, WebSocketPlugin, handleSubmitForm } from "../../utilities/meetingInfoUtils"
import { useLazyQuery, useMutation, gql } from "@apollo/client"
import { createContext } from "react"


const CreateMeeting = ()=>{
    let [meetingInfo, setMeetingInfo] = useState({})
    let redirect, backendResponse
    redirect = useNavigate()
    useEffect(()=>{
        // redirect based on backend responses
        console.log("backend response... ", backendResponse)
        if(backendResponse == "meeting successfully created!"){
            redirect("/dashboard")
        }
        else if(backendResponse == "joining"){
            // redirect to meeting room
            redirect("/meeting-room")
        }
        else if(backendResponse == "Not found"){
            redirect("/")
        }
        else if(backendResponse == "failed to create meeting"){
            redirect("/create-meeting")
        }
    }, [backendResponse])
    return (
        <div className="create-meeting">
            <form>
                <label htmlFor="meeting-title">
                    <p id="title-txt">Title:</p>
                    <input type="text" name="meeting-title" placeholder="Meeting title..." id="meeting-title" onChange={(e)=> handleMeetingInput(e,setMeetingInfo)}/>
                </label>
                <label htmlFor="start-date">
                    <p id="start-date-txt">Start date:</p>
                    <input type="date" id="start-date" name="start-date" onChange={(e)=> handleMeetingInput(e,setMeetingInfo)}/>
                </label>
                <label htmlFor="end-date">
                    <p id="end-date-txt">End date:</p>
                    <input type="date" id="end-date" name="end-date" onChange={(e)=> handleMeetingInput(e,setMeetingInfo)}/>
                </label>
                <label htmlFor="password">
                    <p id="password-txt">Password:</p>
                    <input type="password" name="meeting-password" id="meeting-password" placeholder="password" onChange={(e)=>handleMeetingInput(e, setMeetingInfo)}/>
                </label>
                <label htmlFor="btn" id="btn-label">
                    <button type="button" name="create-meeting" id="create-btn" onClick={(e)=>{
                        backendResponse = handleSubmitForm(e, meetingInfo)
                        }}>
                    Submit
                    </button>
                </label>
            </form>
        </div>
    )
}

export default CreateMeeting