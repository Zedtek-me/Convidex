import React, {useState} from "react"
import { handleMeetingInput, handleSubmitForm } from "../../utilities/meetingInfoUtils"

const CreateMeeting = ()=>{
    let [meetingInfo, setMeetingInfo] = useState({})
    return (
        <div className="create-meeting">
            <form>
                <input type="text" name="meeting-title" placeholder="Meeting title..." id="meeting-title" onChange={(e)=> handleMeetingInput(e,setMeetingInfo)}/>
                <input type="date" id="start-date" name="start-date" onChange={(e)=> handleMeetingInput(e,setMeetingInfo)}/>
                <input type="date" id="end-date" name="end-date" onChange={(e)=> handleMeetingInput(e,setMeetingInfo)}/>
                <input type="password" name="meeting-password" id="meeting-password" placeholder="password" onChange={(e)=>handleMeetingInput(e, setMeetingInfo)}/>
                <button type="button" name="create-meeting" onClick={(e)=>handleSubmitForm(e, meetingInfo)}>Submit</button>
            </form>
        </div>
    )
}

export default CreateMeeting