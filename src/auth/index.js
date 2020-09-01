export const signUp = company => {
    return fetch(`${process.env.REACT_APP_API_URL}/root/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(company)
    })
    .then(res => {
        return res.json()
    })
    .catch(err => console.log(err));
};

export const signIn = company => {
    return fetch(`${process.env.REACT_APP_API_URL}/root/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(company)
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const signOut = next => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwt");
        localStorage.removeItem("history");
    }
    next();
    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {
        method: "GET"
    })
        .then(res => {
            console.log("signout", res);
            return res.json();
        })
        .catch(err => console.log(err));
};

export const userSignIn = user => {
    return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const authenticate = (jwt, next) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify(jwt));
        next(); 
    }
};

export const isAuthenticated = () => {
    if (typeof window == "undefined") {
        return false;
    }

    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"));
    } else {
        return false;
    }
};

export const forgotPassword = email => {
    console.log("email: ", email);
    return fetch(`${process.env.REACT_APP_API_URL}/root/forgot-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};
 
export const resetPassword = resetInfo => {
    return fetch(`${process.env.REACT_APP_API_URL}/root/reset-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};

export const userForgotPassword = email => {
    console.log("email: ", email);
    return fetch(`${process.env.REACT_APP_API_URL}/forgot-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};
 
export const userResetPassword = resetInfo => {
    return fetch(`${process.env.REACT_APP_API_URL}/reset-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};

export const saveHistoryToStorage = (history, input, link, type) => {
    // initialize history object
    if (!history) {
        history = {handshakes: []};
        history.customers = [];
    }

    //local storage only takes in key value pair so you would have to serialize it.
    if (typeof window !== "undefined") {
        if (type === 'handshake') {
            //let history = data.handshakes ? data.handshakes : {handshakes: []};
            if (!history.handshakes.some(h => h.text === input)) {
                history.handshakes.push({ text: input, link });
                localStorage.setItem('history', JSON.stringify(history)); 
            }
        } else if (type === 'customer') {
            // let history = data.customers ? data.customers : {customers: []};
            // history.handshakes = data.handshakes
            if (!history.customers.some(h => h.text === input)) {
                history.customers.push({ text: input, link });
                localStorage.setItem('history', JSON.stringify(history)); 
            }
        }
    }
};