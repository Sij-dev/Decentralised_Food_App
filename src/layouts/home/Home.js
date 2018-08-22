import React, { Component } from 'react'

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1> <center>FoodForAll!</center> </h1>
            <h2><center>Fighting hunger .. Transforming Lives .. Transforming the World !!.</center></h2>
            <p> Around the world, more than 800 million people go to bed hungry every day. That is roughly one in every 10 people remain hungry in the globe.</p>
            <p>FoodForAll is a non-profit organization that aims to create food secure communities by providing a decentralized food accumulation, recovery and delivery network. We aim to achieve this by intervening in food wastage and utilize existing resources to create more food secure communities</p>
            <h2>Be the change that you want to see in this World !!</h2>
            <p>Let us recover food that is destined to the bin to nourish the needy ..</p>
            <h3>Be part of this great movement by contributing in any of the below roles</h3>
            <ul>
              <li>Food Requester    - Publishing the need for food in a region.</li>
              <li>Food Provider     - Those who are ready to provide food to the needy.</li>
              <li>Delivery Provider - Those who are ready to transport and deliver food.</li>
            </ul>
            <br/>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
