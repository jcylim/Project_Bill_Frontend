export const list = (companyId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/tasks`, {
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

export const adminCreate = (companyId, token, task) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/task`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(task)
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const create = (companyId, userId, token, task) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/task/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(task)
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const singleTask = (companyId, taskId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/task/${taskId}`, {
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

export const remove = (companyId, taskId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/task/${taskId}`, {
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

export const listByUser = (companyId, userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/tasks/${userId}`, {
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

export const listByCustomer = (companyId, customerId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/tasks/customer/${customerId}`, {
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

export const listByHandshake = (companyId, handshakeId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/tasks/handshake/${handshakeId}`, {
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

export const update = (companyId, taskId, token, task) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/task/${taskId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(task)
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const assign = (companyId, taskId, email, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/task/assign/${taskId}`, {
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

export const unassign = (companyId, taskId, email, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/task/unassign/${taskId}`, {
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

export const setStage = (companyId, taskId, stage, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/task/stage/${taskId}`, {
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

export const comment = (companyId, userId, taskId, token, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/task/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, taskId, comment})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const uncomment = (companyId, userId, taskId, token, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/task/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, taskId, comment})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};