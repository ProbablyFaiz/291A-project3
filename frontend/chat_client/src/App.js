import React, { Component } from "react";
import './css/App.css';
import Compose from "./components/Compose.js";
import LoginForm from "./components/LoginForm.js";
import MessageList from "./components/MessageList.js";
import UserList from "./components/UserList.js";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      url : sessionStorage.url || "https://chat.cs291.com",
      messages : [],
      users : [],
      displayUsersMessages : false,
      displayLogin : true
    }
    this.addUser = this.addUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.loggedIn = this.loggedIn.bind(this);
    this.saveToken = this.saveToken.bind(this);
    this.startStream = this.startStream.bind(this);
  }

  addUser(userToAdd){
    if (!(this.state.users.filter(user => user === userToAdd).length > 0)) {
      this.setState(prevState => ({users: prevState.users.concat(userToAdd)}));
    }
  }

  deleteUser(userToDelete){
      this.setState(prevState => ({
          users: prevState.users.filter(user => user !== userToDelete )
      }));
  }

  formatDate(timestamp){
    let t = new Date(timestamp*1000);
    let formatted = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(t);
    return formatted;
  }

  loggedIn(){
    this.setState({displayLogin : false});
    this.setState({displayUsersMessages : true});
  }

  saveToken(token){
    sessionStorage.accessToken = token;
  }

  startStream() {
    this.eventSource = new EventSource(this.state.url + "/stream/" + sessionStorage.accessToken);

    this.eventSource.addEventListener(
        "Disconnect",
        (event) => {
            this.eventSource.close();
            //todo: delete user from list?
            delete sessionStorage.accessToken;
            this.setState({displayLogin : true});
            this.setState({displayUsersMessages : false});
        },
        false
    );

    this.eventSource.addEventListener(
        "Join",
        (event) => {
            var data = JSON.parse(event.data);
            this.addUser(data.user);
            this.setState(prevState => ({messages: prevState.messages.concat(this.formatDate(data["created"]) + " JOIN: " + data.user)}));
        },
        false
    );

    this.eventSource.addEventListener(
        "Message",
        (event) => {
            var data = JSON.parse(event.data);
            this.setState(prevState => ({messages: prevState.messages.concat(this.formatDate(data["created"]) + " (" + data.user + ") " + data.message)}));
        },
        false
    );

    this.eventSource.addEventListener(
        "Part",
        (event) => {
            var data = JSON.parse(event.data);
            this.deleteUser(data.user);
            this.setState(prevState => ({messages: prevState.messages.concat(this.formatDate(data["created"]) + " PART: " + data.user)}));
        },
        false
    );

    this.eventSource.addEventListener(
        "ServerStatus",
        (event) => {
            var data = JSON.parse(event.data);
            this.setState(prevState => ({messages: prevState.messages.concat(this.formatDate(data["created"]) + " STATUS: " + data.status)}));
        },
        false
    );

    this.eventSource.addEventListener(
        "Users",
        (event) => {
            this.setState({displayLogin : false});
            this.setState({displayUsersMessages : true});
            this.setState({users:JSON.parse(event.data).users});
        },
        false
    );

    this.eventSource.addEventListener(
        "error",
        (event) => {
            //todo: delete user from list?
            this.setState({displayUsersMessages : false});
            if (event.target.readyState === 2) {
                delete sessionStorage.accessToken;
                this.setState({displayLogin : true});
            } else {
                console.log("Disconnected, retrying");
            }
        },
        false
    );
  }


  render() {
    if (this.state.displayLogin)
    {
      return (<div className="App">
                <h3> Disconnected. </h3>
                <br/>
                <LoginForm url = {this.state.url} loggedIn = {this.loggedIn} saveToken = {this.saveToken} startStream = {this.startStream}/>
              </div>);
    }
    return (
      <div className="App">
        <h3> Connected. </h3>
        <br/>
        <div className = "lists">
          <div class="col-9">
            <MessageList displayMessages = {this.state.displayUsersMessages} messages={this.state.messages}/>
          </div>
          <div class="col-3">
            <UserList displayUsers = {this.state.displayUsersMessages} users={this.state.users}/>
          </div>
        </div>
        <hr />
        <Compose url = {this.state.url}/>
      </div>
    );
  }
}

export default App;
