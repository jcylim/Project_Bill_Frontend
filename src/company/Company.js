import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import { getCompany } from './apiCompany';
import { listHandshakes } from '../handshake/apiHandshake';
import { listUsers } from '../user/apiUser';
import CompanyTabs from './CompanyTabs';
import DefaultCompany from '../img/companyPic.jpg';

class Company extends Component {
    constructor() {
        super();
        this.state = {
            company: {},
            redirectToSignIn: false,
            error: '',
            handshakes: [],
            employees: []
        }
    }

    loadHandshakes = companyId => {
        const token = isAuthenticated().token;
        
        listHandshakes(companyId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ handshakes: data });
            }
        })
    };

    loadUsers = companyId => {
        const token = isAuthenticated().token;

        listUsers(companyId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ employees: data });
            }
        })
    };

    init = companyId => {
        const token = isAuthenticated().token;

        getCompany(companyId, token)
        .then(data => {
            if(data.error) {
                this.setState({ redirectToSignIn: true });
            } else {
                this.setState({ company: data });
                this.loadHandshakes(companyId);
                this.loadUsers(companyId);
            }
        })
    };

    componentDidMount() {
        const companyId = this.props.match.params.companyId;
        this.init(companyId);
    }

    componentWillReceiveProps(props) {
        const companyId = props.match.params.companyId;
        this.init(companyId);
    }

    render() {
        const { company, redirectToSignIn, handshakes, employees } = this.state;
        if (redirectToSignIn) return <Redirect to="/signin" />

        const photoUrl = company._id ? `${process.env.REACT_APP_API_URL}/${company._id}/photo?${new Date().getTime()}` : DefaultCompany;

        return (
            <div className="container">
                <h2 className='mt-5 mb-5'>Company Profile</h2>
                <div className="row">
                    <div className="col-md-4">
                        <img 
                            src={photoUrl}
                            onError={i => (i.target.src = `${DefaultCompany}`)}
                            alt={company.name} 
                            style={{height: '200px', width: 'auto'}}
                            className='img-thumbnail'
                        />
                    </div>

                    <div className="col-md-8">
                        <div className="lead mt-2">
                            <p>
                                <b>Company Name:</b> {company.name}
                            </p>
                            <p>
                                <b>Company Description:</b>
                                <br/>
                                {company.about}
                            </p>
                            <p>Joined since {new Date(company.created).toDateString()}</p>
                        </div>
                        {isAuthenticated().company && (
                            <div className="d-inline-block">
                                <Link className="btn btn-raised btn-success mr-5" to={`/${company._id}/edit`}>
                                    Edit Company Profile
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col md-12 mt-5 mb-3">
                        <CompanyTabs 
                            handshakes={handshakes}
                            users={employees}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Company;