import React, { Component } from 'react'
import NewCampaign from '../../ui/campaign/newcampaign/newCampaignContainer'

class Participate extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Participate</h1>
            <p><strong>Congratulations {this.props.authData.name}!</strong> How are you going to contribute?.</p>
            <NewCampaign />
          </div>
        </div>
      </main>
    )
  }
}

export default Participate
