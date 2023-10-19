import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import dotenv from "dotenv"
import { redirect } from "react-router-dom";
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
    if(!stateInfo || !stateInfo["meeting-title"]) return "Not found"
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
        // send a request togt meeting to join the meeting
        let meetingTojoin = await getRemoteMeetingInfo(stateInfo)
        if(meetingTojoin && (meetingTojoin != "No meeting found!" && !(meetingTojoin == "Meeting password is wrong!"))){
            /* 
            We got our meeting here, so:
            check to be sure there's a remote offer already, and that the remote offer matches that of the.
            meeting we want to join.
            if not, get send a request to get the offer of the meeting user wishes to join
            else, cros
            **/
            let meetingOffer = meetingTojoin.offer
            await rtcConnection.peerConnection.setRemoteDescription(meetingOffer)
            let answer = await rtcConnection.peerConnection.createAnswer()
            await rtcConnection.peerConnection.setLocalDescription(answer)
            console.log("answer created here... ", answer)
            feedback = await createOrJoinMeeting({
                answer:answer,
                meetingLink:stateInfo["meeting-link"],
                meetingTitle : stateInfo["meeting-title"],
                meetingPassword : stateInfo["meeting-password"],
                meetingId: stateInfo["id"] || null
            })
        }

        else if(meetingTojoin && (meetingTojoin == "No meeting found!" || meetingTojoin instanceof Error)){
            feedback = meetingTojoin
        }
    }
    console.log("feedback here... ", feedback)
    if(feedback ? feedback.created : null){
        return feedback.created
    }
    // here you've sent to join a meeting, and it's been successfully created on the backend
    if(feedback ? feedback.joined: null){
        // set remote description with the offer gotten

        // await rtcConnection.peerConnection.setRemoteDescription(meeting_to_join_offer)
        return "joining"
    }

    else{
        return "Not found"
    }
}

export const startScheduledMeeting = ()=>{
    // starts a scheduled meeting for the user; gets the initial offer set on the meeting
}


export const getLocalStreams = async ()=>{
    return await rtcConnection.getLocalMedia()
}

export const handleMeetingResponse = (redirect, backendResponse) =>{
    if(backendResponse == "meeting successfully created!"){
        redirect("/dashboard")
    }
    else if(backendResponse == "joining"){
        // redirect to meeting room
        /**  
         * find a way to send the meeting id as a query param to the meeting room page,
        */
        redirect("/meeting-room", {query:{meetingId:"id of the meeting goes here..."}})
    }
    else if((backendResponse == "Not found")){
        // give some feedback with a tost notification here before redirecting
        setTimeout(()=>redirect("/"), 2000)
    }
    else if(backendResponse == "failed to create meeting"){
        redirect("/create-meeting")
    }
}


export const getRemoteMeetingInfo = async (stateInfo) =>{

    let title, link, password, meeting, id;
    title = stateInfo["meeting-title"]
    link = stateInfo["meeting-link"]
    id = stateInfo["meeting-id"] || null
    password = stateInfo["meeting-password"]
    meeting = await fetch('http://localhost:9000/get-meeting-info/', {
        method:"POST",
        body:JSON.stringify({
            meeting_title:title,
            meeting_id:id,
            meeting_link:link,
            meeting_pass:password
        }),
        headers:{
            "Content-Type":"Application/json"
        }
    })
    meeting = await meeting.json()
    // compare passwords or raise error to user about password
    if(meeting && meeting.password == password){
        return meeting
    }
    else if(meeting && !(meeting.password == password)){
        return "Meeting password is wrong!"
    }
    else return "No meeting found!"
}