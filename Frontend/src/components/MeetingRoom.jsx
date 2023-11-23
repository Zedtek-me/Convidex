import React, { createRef, useRef, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getLocalStreams, getRemoteMeetingInfo, getMeetingJoiner, rtcConnection } from "../utilities/meetingInfoUtils"

const Room = () => {
    let localVidElement = useRef(null)
    let [meetingJoiner, setMeetingJoiner] = useState({})//either the owner of the meeting or remote joiners.
    let [remoteStreams, setRemoteStreams] = useState([])//for all remote streams added to the current conn.
    let [searchParams, setSearchParams] = useSearchParams()
    let meetingJoinerId, remoteMedia, joiner;
    meetingJoinerId = searchParams.get("meetingJoinerId")
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
        const getMeeting = async () => {
            joiner = await getMeetingJoiner(meetingJoinerId=meetingJoinerId)//find a way to modify this function for getting meeting here too.
            if(joiner){
                setMeetingJoiner(joiner)
            }            
        }
        getMeeting()
    }, [meetingJoinerId, joiner])

    rtcConnection.peerConnection.ontrack = ({track, streams}) => {
        setRemoteStreams((curStream) => [...curStream, ...streams])//adds the stream of the remote joiner, which is used in the Room for dynamic vid element creation
        console.log("remote track gotten:\n", track, "remote stream gotten:\n", streams)
    }
    console.log("remote streams... ", remoteStreams)
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