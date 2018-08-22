import React, { Component } from 'react'
import ipfs from '../../../util/ipfs'

class SignUpForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      filebuffer: null,
      ipfsHash: null
    }
  }

  onInputChange = (event) =>  {
    this.setState({ name: event.target.value })
  }

  captureFile = async (event) => {
    console.log("onChangeHandler",event)
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.onloadend = () =>  this.saveToIpfs(reader)
    reader.readAsArrayBuffer(file)
  }  

 async saveToIpfs (reader) {
    let ipfsId
    const buffer = Buffer.from(reader.result)
       await ipfs.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
      .then((response) => {
        console.log(response)
        ipfsId = response[0].hash
        console.log(ipfsId)
        this.setState({ipfsHash: ipfsId})
      }).catch((err) => {
        console.error(err)
      })
  }

  handleSubmit= async (event) => {
    event.preventDefault()

    if (this.state.name.length < 2) {
      return alert('Please fill in your name.')
    }
    this.props.onSignUpFormSubmit(this.state.name,this.state.ipfsHash)
  }

  render() {
    return(
      <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit.bind(this)}>
        <fieldset>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={this.state.name} onChange={this.onInputChange.bind(this)} placeholder="Name" />
          <span className="pure-form-message">This is a required field.</span>
          <br />  
          <label htmlFor="avatar">Please upload your profile picture. Use smaller size(Kb) for IPFS upload </label>
      
          <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
          <input type='file' onChange={this.captureFile.bind(this)} />
          <br />
          <h5> Submit button will be enabled after image uploaded in to IPFS </h5>
          <button type="submit" disabled={!this.state.ipfsHash} className="pure-button pure-button-primary">Sign Up</button>
        </fieldset>
      </form>
    )
  }
}

export default SignUpForm
