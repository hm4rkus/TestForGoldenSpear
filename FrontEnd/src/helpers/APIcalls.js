const link = "http://localhost:9000/api"

var token = JSON.parse(localStorage.getItem("userToken"));
if(token)  
    token = token.token

export async function loginCall(email, password) {

    let response = await fetch(link + "/user/login", {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: email,
            password: password,
        }),

    })

    if(response.ok){

        return await response.json();
    }
    else return {success: false};
}

export async function signUpCall(email, password) {

    let response = await fetch(link + "/user/signup", {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: email,
            password: password,
        }),

    })

    if(response.ok){

        return await response.json();
    }
    else return {success: false};
}


export async function postMessage(message) {

    let response = await fetch(link + "/message", {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token

        },
        body: JSON.stringify({
           message: message
        }),

    })

    if(response.ok){

        return await response.json();
    }
    else return {success: false};
}



export async function getMessages(email, password) {

    let response = await fetch(link + "/message", {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token
        },
       
    })

    if(response.ok){

        return await response.json();
    }
    else return {success: false};
}