import React, {createRef, useRef, useEffect, useState} from "react"
import { getLocalStreams } from "../utilities/meetingInfoUtils"
// reference to user local video element
// let localVidRef = createRef(null)

const Room = ()=>{
    let localVidElement = useRef(null)
    useEffect(()=>{
        async function setLocalStream(){
            let localStreams = await getLocalStreams()
            if(localVidElement.current) {localVidElement.current.srcObject = localStreams}
        }
        setLocalStream()
    }, [localVidElement])
    return (
        <div className="meeting-room">
            <div className="video-cont">
                <video className="host-video" ref={localVidElement} autoPlay playsInline></video>
            </div>
            {/* meeting room used for both one-on-one meeting and group meeting */}
        </div>
    )
}


export default Room 