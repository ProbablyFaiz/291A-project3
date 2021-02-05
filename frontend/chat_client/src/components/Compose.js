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
      formText: "",
      error: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
  }

  handleChange (event) {
    this.setState({message: event.target.value});
  }

  save (event) {
    this.setState({error: ""});
    event.preventDefault();

    var formData = new FormData();
    formData.append('message', this.state.message);

    this.setState({token: this.props.token});

    fetch(this.state.url + '/message', {
     method: 'POST',
     headers: new Headers({'Authorization': 'Bearer ' + this.state.token}),
     mode: 'cors',
     body: formData
    }).then((response) => {
      if(!response.ok) {
        this.setState({error: response.status});
      }
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
    let errorMessage;
    if (this.state.error !== "")
    {
      errorMessage = <p style={{ color: 'red' }}>{this.state.error} Error</p>;
    }

    if (this.state.typeable) {
      return (
        <div id="compose">
          {errorMessage}
          <form className="message" onSubmit={this.save}>
            <input id="messageText" type="text" value={this.state.message} onChange={this.handleChange}/>
          </form>
        </div>
      );
    }
    return (
      <div id="compose">
        {errorMessage}
        <form className="message">
          <input id="messageText" type="text" value="Please reconnect to type a message." disabled ="disabled"/>
        </form>
      </div>
    );
  }
}

export default Compose;