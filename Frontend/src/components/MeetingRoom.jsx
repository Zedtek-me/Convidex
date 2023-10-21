import React, { createRef, useRef, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getLocalStreams, getRemoteMeetingInfo, getMeetingJoiner } from "../utilities/meetingInfoUtils"

const Room = () => {
    let localVidElement = useRef(null)
    let [meetingJoiners, setMeetingJoiners] = useState([])
    let [meeting, setMeeting] = useState(null)
    let [searchParams, setSearchParams] = useSearchParams()
    let meetingJoinerId = searchParams.get("meetingJoinerId")
    useEffect(() => {
        async function setLocalStream() {
            let localStreams = await getLocalStreams()
            if (localVidElement.current) { localVidElement.current.srcObject = localStreams }
            /** find a way to get the remote streams from the current connection and use it to create
             * dynamic video elements for connecting remote users here or withing the Jsx element.
            */
        }
        setLocalStream()
    }, [localVidElement])
    // meeting fetcher effect
    useEffect(() => {
        // fetches meeting and update accordingly
        let joiner;
        const getMeeting = async () => {
            joiner = await getMeetingJoiner(meetingJoinerId=meetingJoinerId)//find a way to modify this function for getting meeting here too.
            if(joiner){
                let currentMeeting = joiner.data.meeting
                setMeetingJoiners((currentJoinersArray)=> currentJoinersArray.push(joiner))
                setMeeting(currentMeeting)
            }
        }
        getMeeting()
    }, [meetingJoinerId])
    return (
        <div className="meeting-room">
            <div className="video-cont">
                <video className="room-video" ref={localVidElement} autoPlay playsInline></video>
                {
                /* meeting room used for both one-on-one meeting and group meeting */
                /**
                 * when a user joins a meeting,
                 */
                }
            </div>
        </div>
    )
}


export default Room 