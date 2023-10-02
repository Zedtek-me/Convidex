import React, {createRef, useRef, useEffect, useState} from "react"
import { useGetLocalStreams } from "../utilities/meetingInfoUtils"
// reference to user local video element
let localVidRef = createRef(null)

const Room = async ()=>{
    let localStreams = await useGetLocalStreams()
    let localVidElement = useRef(localVidRef).current
    useEffect(()=>{
        function setLocalStream(){
            localVidElement.srcObject = localStreams
        }
        setLocalStream()
    }, [localVidElement])
    return (
        <div className="meeting-room">
            <div className="host-video-cont">
                <video src="" autoPlay playsInline className="host-video" ref={localVidRef}></video>
            </div>
            {/* meeting room used for both one-on-one meeting and group meeting */}
        </div>
    )
}


export default Room 