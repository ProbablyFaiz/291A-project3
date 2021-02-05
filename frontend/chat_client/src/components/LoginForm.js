import React, { Component } from "react";

class LoginForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      url : "",
      username : "",
      password : "",
      error: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
  }


  handleChange(event) {
    if (event.target.id === "username") {
      this.setState({username: event.target.value});
    }
    else if (event.target.id === "password") {
      this.setState({password: event.target.value});
    }
    else if (event.target.id === "url") {
      this.setState({url: event.target.value});
    }
  }

  save(event) {
    this.setState({error: ""});
    var formData = new URLSearchParams();
    formData.append('username', this.state.username);
    formData.append('password', this.state.password);

    event.preventDefault();


    fetch(this.state.url + '/login', {
     method: 'POST',
     headers: {'Content-Type':'application/x-www-form-urlencoded'},
     mode: 'cors',
     body: formData.toString()
    }).then((response) => {
      if(!response.ok) {
        this.setState({error: response.status});
      }
      else return response.json();
    })
    .then((data) => {
      this.props.saveToken(data["token"]);
      this.props.saveURL(this.state.url);
      this.props.loggedIn();
      this.props.startStream();
    })
    .catch((error) => {
      this.setState({ requestFailed: true });
    });
  }

  render() {
    let errorMessage;
    if (this.state.error !== "")
    {
      errorMessage = <p style={{ color: 'red' }}>{this.state.error} Error</p>;
    }
    return (
      <div id="login">
        <div>
          {errorMessage}
          <h2>Login</h2>
          <form method="post" onSubmit={this.save}>
              <label>URL <br /><input id="url" type="text" onChange={this.handleChange}/></label>
              <br />
              <label>Username <br /><input id="username" type="text" onChange={this.handleChange}/></label>
              <br />
              <label>Password <br /><input id="password" type="password" onChange={this.handleChange}/></label>
              <br />
              <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginForm;