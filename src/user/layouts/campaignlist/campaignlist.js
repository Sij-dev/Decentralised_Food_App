import React, { Component } from 'react'
import CampaignListContainer from '../../ui/campaign/campaignlist/campaignlistContainer'

class CampaignList extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>CampignList</h1>
            <CampaignListContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default CampaignList
