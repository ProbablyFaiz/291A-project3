import React, { Component } from "react";
import '../css/MessageList.css';

class MessageList extends Component {

  constructor(props){
    super(props);
    this.state = {
      displayMessages : props.displayMessages,
      messages: props.messages
    }
  }

  componentDidUpdate(prevProps){
    if (this.props.displayMessages !== prevProps.displayMessages) {
      this.setState({displayMessages : this.props.displayMessages});
    }
    if (this.props.messages !== prevProps.messages) {
      this.setState({messages : this.props.messages});
    }
  }

  render() {
    let messageList;
    if (this.state.displayMessages) {
      messageList = this.state.messages.map((m, index) => <ul key={index}>{m}</ul>);
    }
    return (
      <div className="messageList">
        <p>Messages</p>
        {messageList}
      </div>
    );
  }
}

export default MessageList;