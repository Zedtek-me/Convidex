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


export const handleSubmitForm = (e, stateInfo)=>{
    let element;
    element = e.target
    console.log("state info to be submitted...", stateInfo)
    if(element.name == "create-meeting"){
        // send a request to the create-meeting endpoint on the backend
    }

    else if(element.name == "join-meeting"){
        // send a request to join the meeting
    }
}