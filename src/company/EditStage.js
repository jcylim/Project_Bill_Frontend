import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { getStages, addStage, removeStage } from './apiCompany';
import Loading from '../Loading';
 
class EditStage extends Component {
    constructor() {
        super()
        this.state = {
            stages: {},
            stage: '',
            displayAddMessage: false,
            displayRemoveMessage: false,
            error: '',
            loading: false
        }
    }

    init = companyId => {
        const token = isAuthenticated().token;

        getStages(companyId, token)
        .then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ stages: data.stages });
            }
        });

        console.log(this.state.stages);
    };

    componentDidMount() {
        const companyId = this.props.match.params.companyId;
        this.init(companyId);
    }

    isValid = () => {
        const { stage } = this.state;
        if (stage.length === 0) {
            this.setState({error: "Field is required", loading: false});
            return false;
        }
        return true; 
    };

    clickAddSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        const { stage } = this.state;
        const companyId = this.props.match.params.companyId;
        const token = isAuthenticated().token;

        if (this.isValid()) {
            addStage(companyId, token, stage)
            .then(data => {
                if (data.error) this.setState({error: data.error, loading: false})
                else
                    this.setState({
                        error: '',
                        displayAddMessage: true,
                        loading: false
                    })
            });
        }
    };

    clickRemoveSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        const { stage } = this.state;
        const companyId = this.props.match.params.companyId;
        const token = isAuthenticated().token;

        if (this.isValid()) {
            removeStage(companyId, token, stage)
            .then(data => {
                if (data.error) this.setState({error: data.error, loading: false})
                else
                    this.setState({
                        error: '',
                        displayRemoveMessage: true,
                        loading: false
                    })
            });
        }
    };

    handlerChange = field => event => {
        this.setState({ error: "" });
        this.setState({ [field]: event.target.value });
    };

    stageForm = stage => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Stage</label>
                <input 
                    onChange={this.handlerChange('stage')} 
                    type='text' 
                    className='form-control'
                    value={stage}
                />
            </div>
            <button 
                onClick={this.clickAddSubmit}
                className='btn btn-raised btn-success mr-4'>
                Add
            </button>
            <button 
                onClick={this.clickRemoveSubmit}
                className='btn btn-raised btn-danger'>
                Remove
            </button>
        </form>
    );

    render() {
        const { 
            stages,
            stage,
            displayAddMessage,
            displayRemoveMessage,
            error,
            loading 
        } = this.state;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Add/Remove Stage</h2>
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>

                <Loading loading={loading} />

                <div 
                    className='alert alert-info'
                    style={{ display: displayAddMessage ? '' : 'none'}}
                >
                    Stage has been added successfully.
                </div>
                <div 
                    className='alert alert-info'
                    style={{ display: displayRemoveMessage ? '' : 'none'}}
                >
                    Stage has been removed successfully.
                </div>

                {/* <h3 className='mb-5'>Stages</h3>
                {stages && stages.map((stage, i) => (
                    <p>{stage}</p>
                ))} */}

                { this.stageForm(stage) }
            </div>
        );
    }
}

export default EditStage;