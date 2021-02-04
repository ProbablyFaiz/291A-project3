import React, { Component } from "react";
//import '../css/UserList.css';
class UserList extends Component {
  constructor(props){
    super(props);
    this.state = {
      displayUsers : props.displayUsers,
      users : props.users
    }
  }

  componentDidUpdate(prevProps){
    if (this.props.displayUsers !== prevProps.displayUsers) {
      this.setState({displayUsers : this.props.displayUsers});
    }
    if (this.props.users !== prevProps.users) {
      this.setState({users : this.props.users});
    }
  }

  render() {
    let userList;
    if (this.state.displayUsers) {
      userList = this.state.users.map((u, index) => <ul key={index}>{u}</ul>);
    }
    return (
      <div className="userList">
        <p>Online</p>
        {userList}
      </div>
    );
  }
}

export default UserList;