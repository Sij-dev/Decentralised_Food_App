import React, { Component } from 'react';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import {getAllCampaignList} from './campaignlistAction' ;

class CampaignList extends Component {

    // async componentWillMount() {
    //     this.props.dispatch(this.props.getAllCampaignList());
    // }

    // handleClick(campaign) {
    //     console.log(campaign)
    // }


    renderCampains(campigns) {
        return (
            <tr key={campigns} >
                <td>
                    {campigns}
                </td>
            </tr>
        );

    }

    render() {
        return (
            <table className="pure-table">
                <thead>
                    <tr>
                        <th>ContractAddress</th>
                    </tr>
                
                </thead>
                <tbody>
                    {this.props.allCampaignlist.deployedcampaigns.map(this.renderCampains)}
                </tbody>
            </table>
        );
    }

}

const mapStateToProps = (state, ownProps) => {
   // console.log("In mapStateToProps",state.campaign.newcampaign);
    return {
        allCampaignlist: state.campaign.allCampaignlist,
        newcampaign : state.campaign.newcampaign
    }
}

const mapDispatchToProps= (dispatch) => {
    
    return bindActionCreators({getAllCampaignList},dispatch)
}


const CampaignListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
  )(CampaignList)
  
export default CampaignListContainer;