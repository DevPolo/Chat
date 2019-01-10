import React, { Component } from 'react';
import firebase from '../../firebase';
import { Segment, Button, Input, ButtonGroup } from 'semantic-ui-react';

class MessagesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      channel: this.props.currentChannel,
      user: this.props.currentUser,
      loading: false,
      errors: []
    };
  }

  sendMessages = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;

    if (message) {
      this.setState({
        loading: true
      });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({
            loading: false,
            message: '',
            errors: []
          });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Add a message' })
      });
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      content: this.state.message,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      }
    };
    return message;
  };

  render() {
    const { errors, message, loading } = this.state;

    return (
      <Segment className='message__form'>
        <Input
          fluid
          name='message'
          onChange={this.handleChange}
          value={message}
          style={{ marginBottom: '0.7em' }}
          label={<Button icon={'add'} />}
          labelPosition='left'
          className={
            errors.some(error => error.message.includes('message'))
              ? 'error'
              : ''
          }
          placeholder='Write your message'
        />
        <ButtonGroup icon widths='2'>
          <Button
            onClick={this.sendMessages}
            disabled={loading}
            color='orange'
            content='Add Reply'
            labelPosition='left'
            icon='edit'
          />
          <Button
            color='teal'
            content='Upload Media'
            labelPosition='right'
            icon='cloud upload'
          />
        </ButtonGroup>
      </Segment>
    );
  }
}

export default MessagesForm;
