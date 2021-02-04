import React, { Component } from "react";

class LoginForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      url : props.url,
      username : "",
      password : ""
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
  }

  save(event) {
    //const proxyurl = "https://cors-anywhere.herokuapp.com/";
    //var formData = new FormData();
    var formData = new URLSearchParams();
    formData.append('username', this.state.username);
    formData.append('password', this.state.password);

    event.preventDefault();


    fetch(/*proxyurl + */this.state.url + '/login', { //todo: change url to website
     method: 'POST',
     headers: {'Content-Type':'application/x-www-form-urlencoded'},
     mode: 'cors',
     body: formData.toString()
    }).then((response) => {
      if(!response.ok) throw new Error(response.status);
      else return response.json();
    })
    .then((data) => {
      this.props.saveToken(data["token"]);
      this.props.loggedIn();
      this.props.startStream();
    })
    .catch((error) => {
      console.log('error: ' + error);
      this.setState({ requestFailed: true });
    });
  }

  render() {
    return (
      <div id="login">
        <div>
          <h2>Login</h2>
          <form method="post" onSubmit={this.save}>
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