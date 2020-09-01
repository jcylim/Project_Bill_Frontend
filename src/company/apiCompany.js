export const getCompany = (companyId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}`, {
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

export const update = (companyId, token, companyData) => {
    console.log('updated company data: ', companyData);
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: companyData
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const updateCompany = (company, next) => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('jwt')) {
            let auth = JSON.parse(localStorage.getItem('jwt'));
            auth.company = company;
            localStorage.setItem('jwt', JSON.stringify(auth));
            next();
        }
    }
};

export const comment = (companyId, token, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({companyId, comment})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};

export const uncomment = (companyId, token, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/${companyId}/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({companyId, comment})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => console.log(err));
};