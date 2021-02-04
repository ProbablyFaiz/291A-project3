import React, { Component } from "react";
//import '../css/Compose.css';
//import { Button } from 'react-bootstrap';

class Compose extends Component {

  constructor(props){
    super(props);
    this.state = {
      url : props.url,
      message: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
  }

  handleChange (event) {
    this.setState({message: event.target.value});
  }

  save (event) {
    var formData = new URLSearchParams();
    formData.append('message', this.state.message);

    event.preventDefault();


    fetch(/*proxyurl + */this.state.url + '/message', { //todo: change url to website
     method: 'POST',
     headers: {'Authorization': 'Bearer ' + sessionStorage.accessToken},
     mode: 'cors',
     body: formData.toString()
    }).then((response) => {
      if(!response.ok) throw new Error(response.status);
      else return response.json();
    })
    .then((data) => {
      console.log("message sent successfully");
    })
    .catch((error) => {
      console.log('error: ' + error);
      this.setState({ requestFailed: true });
    });
  }

  render() {
    return (
      <div id="compose">
        <form className="message" onSubmit={this.save}>
          <input id="messageText" type="text" onChange={this.handleChange}/>
        </form>
      </div>
    );
  }
}

export default Compose;