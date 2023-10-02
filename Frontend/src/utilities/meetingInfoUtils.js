import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import dotenv from "dotenv"

dotenv.config()

const signalServerUrl = process.env.SIGNAL_SERVER_URL || "ws://localhost:9000/signaling/"
const graphEndpoint = process.env.GRAPH_ENDPOINT
export const cache = new InMemoryCache()
export const graphClient = new ApolloClient({
    cache:cache,
    uri:graphEndpoint
})

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
        msg = JSON.stringify(msg)
        this.signalingServer.send(msg)
    }

}


export const createOrJoinMeeting = async (meetingDetails)=>{
    if(meetingDetails.offer){
        let response = await fetch("http://localhost:9000/create-meeting/", {
            method:"POST",
            body: JSON.stringify({
                title:meetingDetails.title,
                password:meetingDetails.password,
                start_date:meetingDetails.startDate,
                end_date:meetingDetails.endDate,
                offer:meetingDetails.offer
            }),
            headers:{
                "Content-Type":"application/json"
            }
        })
        let data = await response.json()
        return data || null
    }
    else if (meetingDetails.answer){
        let response = await fetch("http://localhost:9000/join-meeting/", {
            method:"POST",
            body: JSON.stringify({
                meeting_link: meetingDetails.meetingLink,
                meeting_id: meetingDetails.meetingId,
                meeting_title:meetingDetails.meetingTitle,
                meeting_pass: meetingDetails.meetingPassword,
                answer: meetingDetails.answer
            }),
            headers:{
                "Content-Type":"application/json"
            }
        })
        let data = await response.json()
        return data || null
    }
}

// instantiate signalingServer here
const socket = new WebSocketPlugin(signalServerUrl)
const rtcConnection = new WebRtcPlugin({iceServers:[{"urls":["stun:stun.l.google.com:19302"]}]})
const date = new Date()

var feedback;
socket.signalingServer.onmessage = (e)=>{
    feedback = JSON.parse(e.data)
    console.log("feedback from signaling server ... ", feedback)
}

export const handleSubmitForm = async (e, stateInfo)=>{
    var element;
    element = e.target
    if(element.name == "create-meeting"){
        // send message to backend to create meeting
        let offer = await rtcConnection.peerConnection.createOffer()
        await rtcConnection.peerConnection.setLocalDescription(offer)
        console.log("offer created here... ", offer)
        try{
            let data = {
                offer: offer,
                title: stateInfo["meeting-title"] ?? "Untitled",
                startDate: stateInfo["start-date"] ?? date.toJSON(),
                endDate: stateInfo["end-date"] ?? "",
                password: stateInfo["meeting-password"] ?? ""
            }

            feedback = await createOrJoinMeeting(data)
        }
        catch(e){
            console.log("error occured when sending meeting credentials... ", e)
            feedback = "failed to create meeting"
            return feedback
        }
    }

    else if(element.name == "join-meeting"){
        // send a request to join the meeting
        let answer = await rtcConnection.peerConnection.createAnswer()
        await rtcConnection.peerConnection.setLocalDescription(answer)
        console.log("answer created here... ", answer)
        feedback = await createOrJoinMeeting({
            answer:answer,
            meetingLink:stateInfo["meeting-link"],
            meetingTitle : stateInfo["meeting-title"],
            meetingPassword : stateInfo["password"]
        })
    }
    console.log("feedback here... ", feedback)
    if(feedback ? feedback.created : null){
        return feedback.created
    }
    // here you've sent to join a meeting, and it's been successfully created on the backend
    if(feedback ? feedback.joined: null){
        // set remote description with the offer gotten
        let meeting_to_join_offer = feedback?.data?.offer
        await rtcConnection.peerConnection.setRemoteDescription(meeting_to_join_offer)
        return "joining"
    }

    else{
        return "Not found"
    }
}

export const startScheduledMeeting = ()=>{
    // starts a scheduled meeting for the user; gets the initial offer set on the meeting
}


export const useGetLocalStreams = async ()=>{
    return await rtcConnection.getLocalMedia()
}