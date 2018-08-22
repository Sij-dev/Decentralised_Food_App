const initialState = {
    newcampaign: null,
    allCampaignlist:[]
  }
  
  const campaignReducer = (state = initialState, action) => {
    if (action.type === 'NEW_CAMPAIGN_SUBMITTED')
    {
      return Object.assign({}, state, {
        newcampaign: action.payload
      })
    }
    if (action.type === 'GET_CAMPAIGN_LIST') 
    {
      return Object.assign({}, state, {
        allCampaignlist: action.payload
      })
    }
    return state
  }
  
  export default campaignReducer
  