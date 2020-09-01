import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { assign } from './apiTask';
import { listUsers } from '../user/apiUser';
import { isAuthenticated } from '../auth';

class AssignTask extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            employees: [],
            loading: false,
            error: '',
            redirectToTask: false
        }
    }

    componentDidMount() {
        const companyId = this.props.match.params.companyId;
        this.loadUsers(companyId);
    }

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

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const email = this.state.email;
        const companyId = this.props.match.params.companyId;
        const taskId = this.props.match.params.taskId;
        
        assign(companyId, taskId, email, isAuthenticated().token)
        .then(data => {
            if (data.error) {
                this.setState({error: data.error});
            } else {
                this.setState({
                    redirectToTask: true,
                    loading: false
                })
            }
        });
    };

    handlerChange = field => event => {
        this.setState({ error: "" });
        this.setState({ [field]: event.target.value });
    };

    assignTaskForm = email => (
        <form>
            <div className='form-group'>
                <label className='text'>Email</label>
                <input 
                    onChange={this.handlerChange('email')} 
                    type='email' 
                    className='form-control'
                    placeholder='e.g. test@workflow.com'
                    value={email}
                />
            </div>
            <button 
                onClick={this.clickSubmit}
                className='btn btn-raised btn-primary'>
                Assign
            </button>
        </form>
    );

    renderUsers = employees => (
        <div className='mt-5'>
            <h3 className='text-primary'>Team Members' Emails</h3>
            <hr/>
            {employees.map((employee, i) => (
                <div key={i}>
                    <div>
                        <p className='lead'>{employee.email}</p>
                    </div>
                </div>
            ))}
        </div>
    );

    render() {
        const { email, employees, error, redirectToTask } = this.state; 
        const companyId = this.props.match.params.companyId;
        const taskId = this.props.match.params.taskId;
        if (redirectToTask) {
            return <Redirect to={`/${companyId}/task/${taskId}`} />;
        }

        return (
            <div className="container">
                <h3 className="mt-5 mb-5">
                    Assign Task To...
                </h3>
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>
                {this.assignTaskForm(email)}
                {this.renderUsers(employees)}
            </div>
        );
    }
}

export default AssignTask;