export const listHandshakes = (companyId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/handshakes`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const addHandshake = (companyId, token, handshake) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/handshake`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(handshake)
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const singleHandshake = (companyId, handshakeId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/handshake/${handshakeId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const remove = (companyId, handshakeId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/handshake/${handshakeId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        }
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const listHandshakesByCustomer = (companyId, customerId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/handshakes/customer/${customerId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const update = (companyId, handshakeId, token, handshake) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/handshake/${handshakeId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(handshake)
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const assign = (companyId, handshakeId, email, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/handshake/assign/${handshakeId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({email})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const unassign = (companyId, handshakeId, email, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/handshake/unassign/${handshakeId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({email})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const setStage = (companyId, handshakeId, stage, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/handshake/stage/${handshakeId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({stage})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const comment = (companyId, userId, handshakeId, token, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/handshake/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, handshakeId, comment})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const uncomment = (companyId, userId, handshakeId, token, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/handshake/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, handshakeId, comment})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};