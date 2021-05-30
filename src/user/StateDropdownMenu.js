import React, { Component } from 'react';


export class StateDropdownMenu extends Component {
    constructor(props){
        super(props)
    }

    //On the change event for the select box pass the selected value back to the parent
    handleChange = event => {
        let value = event.target.value;
        this.props.onSelectStateChange(value);
    }

    render() {
        let states = [
            'AL',
            'AK',
            'AZ',
            'AR',
            'CA',
            'CO',
            'CT',
            'DE',
            'FL',
            'GA',
            'HI',
            'ID',
            'IL',
            'IN',
            'IA',
            'KS',
            'KY',
            'LA',
            'ME',
            'MD',
            'MA',
            'MI',
            'MN',
            'MS',
            'MO',
            'MT',
            'NE',
            'NV',
            'NH',
            'NJ',
            'NM',
            'NY',
            'NC',
            'ND',
            'OH',
            'OK',
            'OR',
            'PA',
            'RI',
            'SC',
            'SD',
            'TN',
            'TX',
            'UT',
            'VT',
            'VA',
            'WA',
            'WV',
            'WI',
            'WY'
        ];
        let options = states.map((state, i) =>
            <option key={i}>
                {state}
            </option>
        );

        return (
            <div className="form-group col-md-2">
                <label for="inputState">State<span style={{color: 'red'}}>*</span></label>
                <select id="inputState" className="form-control text-muted" onChange={this.handleChange}>
                    <option>Choose...</option>
                    {options}
                </select>
            </div>
        )
    }
}

export default StateDropdownMenu;