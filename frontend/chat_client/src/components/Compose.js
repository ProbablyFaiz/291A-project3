import React, { Component } from "react";
import '../css/Compose.css';

class Compose extends Component {

  constructor(props){
    super(props);
    this.state = {
      url : props.url,
      message: "",
      token: props.token,
      typeable: props.typeable,
      formText: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
  }

  handleChange (event) {
    this.setState({message: event.target.value});
  }

  save (event) {
    event.preventDefault();

    var formData = new FormData();
    formData.append('message', this.state.message);

    this.setState({token: this.props.token});

    console.log("compose save token: " + this.state.token);

    fetch(/*proxyurl + */this.state.url + '/message', { //todo: change url to website
     method: 'POST',
     headers: new Headers({'Authorization': 'Bearer ' + this.state.token}),
     mode: 'cors',
     body: formData
    }).then((response) => {
      if(!response.ok) throw new Error(response.status);
      else return response.json();
    })
    .then((data) => {
    })
    .catch((error) => {
      this.setState({ requestFailed: true });
    });

    this.setState({message: ""});
  }

  componentDidUpdate(prevProps){
    if (this.props.typeable !== prevProps.typeable) {
      this.setState({typeable: this.props.typeable});
    }
  }

  render() {
    if (this.state.typeable) {
      return (
        <div id="compose">
          <form className="message" onSubmit={this.save}>
            <input id="messageText" type="text" value={this.state.message} onChange={this.handleChange}/>
          </form>
        </div>
      );
    }
    return (
      <div id="compose">
        <form className="message">
          <input id="messageText" type="text" value="Please reconnect to type a message." disabled ="disabled"/>
        </form>
      </div>
    );
  }
}

export default Compose;