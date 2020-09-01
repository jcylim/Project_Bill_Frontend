export const listCustomers = (companyId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/customers`, {
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

export const read = (companyId, customerId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/customer/${customerId}`, {
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

export const removeCustomer = (companyId, customerId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/customer/${customerId}`, {
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

export const addCustomer = (companyId, token, customer) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/customer`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(customer)
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

// export const adminAddCustomer = (companyId, token, customer) => {
//     return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/customer`, {
//         method: "POST",
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}` 
//         },
//         body: JSON.stringify(customer)
//     })
//     .then(res => {
//         return res.json();
//     })
//     .catch(err => console.log(err));
// };

export const update = (companyId, customerId, token, customer) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/customer/${customerId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(customer)
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const comment = (companyId, userId, customerId, token, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/customer/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, customerId, comment})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const uncomment = (companyId, userId, customerId, token, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/customer/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, customerId, comment})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};