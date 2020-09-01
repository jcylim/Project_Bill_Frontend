import React, { Component } from 'react';


export class IndustryDropdownMenu extends Component {
    constructor(props){
        super(props)
    }

    //On the change event for the select box pass the selected value back to the parent
    handleChange = event => {
        let value = event.target.value;
        this.props.onSelectIndustryChange(value);
    }

    render() {
        let industries = [
            'Energy',
            'Materials',
            'Industrials',
            'Consumer Discretionary',
            'Consumer Staples',
            'Healthcare',
            'Financials',
            'Information Technology',
            'Telecommunication Services',
            'Utilities',
            'Real Estate'
        ];
        let options = industries.map((industry, i) =>
            <option key={i}>
                {industry}
            </option>
        );

        return (
            <div className="form-group col-md-4">
                <label for="inputState">Industry</label>
                <select id="inputState" className="form-control" onChange={this.handleChange}>
                    <option>Choose...</option>
                    {options}
                </select>
            </div>
        )
    }
}

export default IndustryDropdownMenu;