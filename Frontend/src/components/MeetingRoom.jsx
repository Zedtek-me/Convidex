import React, {createRef, useRef, useEffect, useState} from "react"
import { useSearchParams } from "react-router-dom"
import { getLocalStreams, getRemoteMeetingInfo } from "../utilities/meetingInfoUtils"
// reference to user local video element
// let localVidRef = createRef(null)

const Room = ()=>{
    let localVidElement = useRef(null)
    let [meetingJoiners, setMeetingJoiners] = useState([])
    let [meeting, setMeeting] = useState(null)
    let [searchParams, setSearchParams] = useSearchParams()
    let meetingId = searchParams.get("meetingId")
    /**  when a user navigates to this page, get the id of the meeting they want to join/star
     * from a query param named meetingId, then use the id to fetch the meeting details on this pag
    */
    useEffect(()=>{
        async function setLocalStream(){
            let localStreams = await getLocalStreams()
            if(localVidElement.current) {localVidElement.current.srcObject = localStreams}
        }
        setLocalStream()
    }, [localVidElement])
    // meeting fetcher effect
    useEffect(()=>{
        // fetches meeting and update accordingly
        const getMeeting = async ()=>{
            let meeting = await getRemoteMeetingInfo()//find a way to modify this function for getting meeting here too.
            return meeting
        }
        setMeeting(getMeeting())
    }, [meetingId])
    return (
        <div className="meeting-room">
            <div className="video-cont">
                <video className="host-video room-video" ref={localVidElement} autoPlay playsInline></video>
            </div>
            {/* meeting room used for both one-on-one meeting and group meeting */}
        </div>
    )
}


export default Room 