import React, {useState} from "react"
import { useNavigate } from "react-router-dom"
import { handleMeetingInput, CREATE_MEETING } from "../../utilities/meetingInfoUtils"
import { useLazyQuery, useMutation, gql } from "@apollo/client"
import { createContext } from "react"

const CreateMeeting = ()=>{
    let [meetingInfo, setMeetingInfo] = useState({})
    let redirect = useNavigate()
    let [createMeetingFunc, {loading : createLoading, data : createDataa, error : createError}] = useMutation(CREATE_MEETING)

    const handleSubmitForm = (e)=>{
        let element;
        element = e.target
        console.log("state info to be submitted...", meetingInfo)
        if(element.name == "create-meeting"){
            // send a request to the create-meeting mutation on the backend
            createMeetingFunc({
                variables:{
                    title:meetingInfo["meeting-title"],
                    password:meetingInfo["meeting-password"]
                }
            })
            // redirect to the user dashboard where they see all meetings created by themselves
            // there they decide whether they want to start the meeting immediately or not
        }
    
        else if(element.name == "join-meeting"){
            // send a request to join the meeting
        }
    }

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
                    <button type="button" name="create-meeting" id="create-btn" onClick={(e)=>handleSubmitForm(e)}>Submit</button>
                </label>
            </form>
        </div>
    )
}

export default CreateMeeting