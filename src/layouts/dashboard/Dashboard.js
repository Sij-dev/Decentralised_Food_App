import React, { Component } from 'react';
import { browserHistory } from 'react-router';

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    console.log(this.props)
  }

  handleCreateClick= async (event) => {
    event.preventDefault()

    // Used a manual redirect here as opposed to a wrapper.
    // This way, once logged in a user can still access the home page.
    var currentLocation = browserHistory.getCurrentLocation()
    if ('redirect' in currentLocation.query) {
      return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
    }
      //return browserHistory.push('/dashboard')
      return browserHistory.push('/participate')
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>"Food For All" Dashboard</h1>
            <h3>Hi {this.props.authData.name} !</h3>
            <p><strong> Thank you for joining the "Food For All" movement </strong></p>
            <p><strong>Your etherum addres is {this.props.authData.address}! </strong></p>
            <p> You are here for a bigger cause. You can contribute this movement by creating new food request </p>
            <button onClick={this.handleCreateClick.bind(this)}className="pure-button pure-button-primary">Create New FoodForAll Campaign</button>
          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard

{/* <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit.bind(this)}>
<fieldset>
  <label htmlFor="name">Name</label>
  <input id="name" type="text" value={this.state.name} onChange={this.onInputChange.bind(this)} placeholder="Enter new Name" />
  <span className="pure-form-message">This is a required field.</span>
  <br />
  <button type="submit" className="pure-button pure-button-primary">Update</button>
</fieldset>
</form> */}