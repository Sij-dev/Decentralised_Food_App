import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { UserIsAuthenticated, UserIsNotAuthenticated } from './util/wrappers.js'
import getWeb3 from './util/web3/getWeb3'

// Layouts
import App from './App'
import Home from './layouts/home/Home'
import Dashboard from './layouts/dashboard/Dashboard'
import Participate from './user/layouts/participate/participate'
import SignUp from './user/layouts/signup/SignUp'
import Profile from './user/layouts/profile/Profile'
import CampaignList from './user/layouts/campaignlist/campaignlist'


// Redux Store
import store from './store'

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store)

// Initialize web3 and set in Redux.
getWeb3
.then(results => {
  console.log('Web3 initialized!')
})
.catch(() => {
  console.log('Error in web3 initialization.')
})

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="dashboard" component={UserIsAuthenticated(Dashboard)} />
          <Route path="participate" component={UserIsAuthenticated(Participate)} />
          <Route path="signup" component={UserIsNotAuthenticated(SignUp)} />
          <Route path="profile" component={UserIsAuthenticated(Profile)} />
          <Route path="campaignlist" component={UserIsAuthenticated(CampaignList)} />
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)

//<Route path="campaignlist" component={UserIsAuthenticated(CampaignList)} />