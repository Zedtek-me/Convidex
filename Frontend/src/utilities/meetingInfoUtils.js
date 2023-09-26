import { gql } from "@apollo/client";
import dotenv from "dotenv"

dotenv.config()

const signalServerUrl = process.env.SIGNAL_SERVER_URL || 5000

export const CREATE_MEETING = gql`
    mutation CreateMeeting($title:String!, $password:String, $startDate:Date, $endDate:Date){
        createMeeting(title:$title, password:$password, startDate:$startDate, endDate:$endDate){
            message
            meeting{
                title
                password
                link
            }
        }
    }
`

export const handleMeetingInput = (e, stateSetter)=>{
        let element, key, value, data;
        element = e.target
        key = element.name
        value = element.value
        data = {}
        data[key] = value
        return stateSetter((currentState)=>{
            return {
                ...currentState,
                ...data
            }
        })
}



export class WebRtcPlugin{
    constructor(iceConfig){
        this.iceConfig = iceConfig
        this.peerConnection = new RTCPeerConnection(iceConfig)
    }

    async getLocalMedia(){
        let localMediaStream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        })

        return localMediaStream
    }

    async addLocalStreamToConnection(mediaStream){
        let localTracks = await mediaStream.getTracks()
        localTracks.map((track)=>{
            this.peerConnection.addTrack(track, mediaStream)
        })
    }

}


export class WebSocketPlugin{
    constructor(url){
        this.url = url
        this.signalingServer = new WebSocket(url)
    }

    sendMesage(msg){
        let msg = JSON.stringify(msg)
        this.signalingServer.send(msg)
    }

}


export const handleSubmitForm = async (e, stateInfo)=>{
    // instantiate signalingServer here
    const socket = new WebSocketPlugin(signalServerUrl)
    const rtcConnection = new WebRtcPlugin()
    const date = new Date()

    let element, feedback;
    element = e.target
    console.log("state info to be submitted...", meetingInfo)
    if(element.name == "create-meeting"){
        // send message to backend to create meeting
        let offer = await rtcConnection.peerConnection.createOffer()
        await rtcConnection.peerConnection.setLocalDescription(offer)
        console.log("offer created here... ", offer)
        try{
            socket.sendMesage(JSON.stringify({
                "offer": offer,
                "title": stateInfo["meeting-title"] ?? "Untitled",
                "start_date": stateInfo["start_date"] ?? date.toJSON(),
                "end_date": stateInfo["end_date"] ?? "",
                "password": stateInfo["password"] ?? ""
            }))
        }
        catch(e){
            feedback = "failed to create meeting"
            return feedback
        }

    }

    else if(element.name == "join-meeting"){
        // send a request to join the meeting
        let answer = await rtcConnection.peerConnection.createAnswer()
        await rtcConnection.peerConnection.setLocalDescription(answer)
        socket.sendMesage(JSON.stringify({
            "amswer":answer,
            "meeting_link":stateInfo["meeting-link"],
            "meeting_title" : stateInfo["meeting-title"],
            "password" : stateInfo["password"]
        }))
    }

    socket.signalingServer.onmessage = async (e)=>{
        feedback = JSON.parse(e.data)
        if(feedback.created){
            return feedback.created
        }
        // here you've sent to join a meeting, and it's been successfully created on the backend
        if(feedback.meeting_to_join_offer){
            // set remote description with the offer gotten
            await rtcConnection.peerConnection.setRemoteDescription(meeting_to_join_offer)
            return "joining"
        }
    }
}