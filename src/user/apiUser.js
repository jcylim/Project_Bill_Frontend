export const getBasicCompanyInfo = companyId => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/basic`, {
        method: "GET",
        // headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${token}` 
        // }
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const addNewUser = (companyId, token, user) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/user/new`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(user)
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const removeUser = (companyId, userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/user/${userId}`, {
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

export const read = (companyId, userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/user/${userId}`, {
        method: "GET",
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

export const listUsers = (companyId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/users`, {
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

export const update = (companyId, userId, token, userData) => {
    console.log('updated user data: ', userData);
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: userData
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const updateUser = (user, next) => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('jwt')) {
            let auth = JSON.parse(localStorage.getItem('jwt'));
            auth.user = user;
            localStorage.setItem('jwt', JSON.stringify(auth));
            next();
        }
    }
};

export const follow = (userId, token, followId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/follow/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, followId})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const unfollow = (userId, token, unfollowId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/unfollow/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, unfollowId})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};