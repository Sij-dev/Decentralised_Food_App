import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Field , reduxForm} from 'redux-form';
import {newCampaignCreation} from './newCampaignAction'


class NewCampaign extends Component {

    renderField(field) {
        return(
            <div className="pure-form-stacked"> 
                <label> {field.label} </label>
                <input 
                    className="pure-u-23-24" 
                    type="text"
                    {...field.input}
                    required
                />
                <div className="text-help">
                    {field.meta.touched ? field.meta.error : ''}
                </div>
            </div>
        );
    }
    renderDateField(field) {
        return(
            <div className="pure-form-stacked"> 
                <label> {field.label} </label>
                <input 
                    className="pure-u-23-24" 
                    type="datetime-local"
                    value="2018-08-10T00:00"
                    max="2030-06-12T00:00"
                    {...field.input}
                    required
                />
                <div className="text-help">
                    {field.meta.touched ? field.meta.error : ''}
                </div>
            </div>
        );
    }


    onSubmit(values) {
       // console.log(values.time);
        console.log(values);
        this.props.newCampaignCreation(values);

    }
    render() {

        const {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}> 
                <h3> Create New "Food For All" Request </h3>
                <Field 
                    label="For how many people food required? (max 5000)"
                    name="quantity"
                    component={this.renderField}
                /> 
                 <Field 
                    label="Delivery point contact number"
                    name="deliveryNo"
                    component={this.renderField}
                /> 
                <Field 
                    label="Delivery location address (lat: log: and zipcode) "
                    name="locAddr"
                    component={this.renderField}
                /> 
                <Field 
                    label="Delivery date and time (max t+30 days)"
                    name="time"
                    component={this.renderDateField}
                /> 
                <br />
                <button 
                    type="submit"
                    className="pure-button pure-button-primary"> 
                    Submit
                </button>
            </form>
        );
    }
}

function validate(values) {
    const errors  = {};

    // //let quantity = Number(values.quantity)
    // if (!values.quantity){
    //     errors.quantity = "Enter required quantity of food "
    // }

    // if (quantity <0 && quantity >200) {
    //     errors.quantity = " Please enter a number between 0 and 100 as quantity. "
    // }

    // if (!values.deliveryNo) {
    //     errors.deliveryNo = "Enter phone number of the contact person in the delivery point"
    // }

    // if (!values.locAddr ) {
    //     errors.deliveryNo = "Please specify the location address"
    // }
    
    // if (!values.time ) {
    //     errors.deliveryNo = "Please specify the time when they required food "
    // }

    return errors;
}

export default reduxForm({  
    validate: validate,
    form: 'NewCampaignForm',
})(
    connect(null,{newCampaignCreation})(NewCampaign)
);