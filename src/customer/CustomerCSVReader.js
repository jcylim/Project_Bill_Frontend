import React, { Component } from 'react'
import { CSVReader } from 'react-papaparse'
import { addCustomers } from './apiCustomer';


export default class CustomerCSVReader extends Component {

  state = {
    data: [],
    error: '',
    loading: false,
    fileDropped: false
  };

  uploadCustomers = (companyId, token) => {
    let customers = this.state.data;

    customers.map(customer => {
      customer['company'] = companyId
    });

    addCustomers(companyId, token, customers)
    .then(data => {
        if (data.error) this.setState({error: data.error, loading: false})
        else 
            this.setState({
                data: [],
                fileDropped: false,
                loading: false,
                error: ''
            })
    });
  };

  parsedCustomersData = customers => {
    const headers = customers[0].data;
    customers.shift();

    var parseCustomers = customers.reduce((acc, e, idx) =>  {
      acc.push(headers.reduce((r, h, i)=> {r[h] = e.data[i]; return r; }, {}))
      return acc;
    }, [])
    .filter(customer => {
      var good = true;
      Object.values(customer).forEach(v => {
        if (v === undefined) {
          good = false;
        }
      });
      return good;
    });

    return parseCustomers;
    
  }

  handleOnDrop = (data) => {
    const parsedData = this.parsedCustomersData(data);
    this.setState({ data: parsedData, fileDropped: true });
  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  handleOnRemoveFile = (data) => {
    this.setState({ data: [], fileDropped: false, error: "" });
  }

  render() {
    const { companyId, token } = this.props;
    const { error, loading } = this.state;

    return (
      <div className='container'>
        <div 
            className='alert alert-danger'
            style={{ display: error ? '' : 'none'}}
        >
            {error}
        </div>
        <h5>Upload Customers CSV File</h5>
        <CSVReader
          onDrop={this.handleOnDrop}
          onError={this.handleOnError}
          addRemoveButton
          onRemoveFile={this.handleOnRemoveFile}
        >
          <span>Drop CSV file here or click to upload.</span>
        </CSVReader>
        {this.state.fileDropped && (
          <button onClick={() => this.uploadCustomers(companyId, token)} className='btn btn-outline-info btn-raised mt-4'>
            Upload
          </button>
        )}
      </div>
    )
  }
}