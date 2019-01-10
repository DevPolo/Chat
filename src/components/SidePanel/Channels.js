import React, { Component } from 'react';
import firebase from '../../firebase';
import {
  MenuMenu,
  Icon,
  MenuItem,
  Modal,
  ModalHeader,
  ModalContent,
  Form,
  FormField,
  Input,
  ModalActions,
  Button
} from 'semantic-ui-react';

import { connect } from 'react-redux';
import { setCurrentChannel } from '../../actions';

class Channels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: [],
      modal: false,
      channelName: '',
      channelDetails: '',
      channelRef: firebase.database().ref('channels'),
      user: this.props.currentUser,
      firstLoad: true,
      activeChannel: ''
    };
  }

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelRef.on('child_added', snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
    });
  };

  removeListeners = () => {
    this.state.channelRef.off();
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.activeChannel(firstChannel);
    }
    this.setState({
      firstLoad: false
    });
  };

  addChannel = () => {
    const { channelRef, channelName, channelDetails, user } = this.state;

    console.log(channelRef);

    const key = channelRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({
          channelName: '',
          channelDetails: ''
        });
        this.closeModal();
        console.log('Channel Added');
      })
      .catch(err => console.log(err));
  };

  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <MenuItem
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </MenuItem>
    ));

  handleSubmit = e => {
    e.preventDefault();

    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  changeChannel = channel => {
    this.activeChannel(channel);
    this.props.setCurrentChannel(channel);
  };

  activeChannel = channel => {
    this.setState({
      activeChannel: channel.id
    });
  };

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  closeModal = () => this.setState({ modal: false });

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  openModal = () => this.setState({ modal: true });

  render() {
    const { channels, modal } = this.state;
    return (
      <React.Fragment>
        <MenuMenu style={{ paddingBottom: '2em' }}>
          <MenuItem>
            <span>
              <Icon name='exchange' /> CHANNELS
            </span>{' '}
            ({channels.length}) <Icon name='add' onClick={this.openModal} />
          </MenuItem>
          {this.displayChannels(channels)}
        </MenuMenu>

        <Modal basic open={modal} onClose={this.closeModal}>
          <ModalHeader>Add a Channel</ModalHeader>
          <ModalContent>
            <Form onSubmit={this.handleSubmit}>
              <FormField>
                <Input
                  fluid
                  label='Name of Channel'
                  name='channelName'
                  onChange={this.handleChange}
                />
              </FormField>
              <FormField>
                <Input
                  fluid
                  label='About the Channel'
                  name='channelDetails'
                  onChange={this.handleChange}
                />
              </FormField>
            </Form>
          </ModalContent>

          <ModalActions>
            <Button color='green' inverted onClick={this.handleSubmit}>
              <Icon name='checkmark' /> Add
            </Button>
            <Button color='red' inverted onClick={this.closeModal}>
              <Icon name='remove' /> Cancel
            </Button>
          </ModalActions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel }
)(Channels);
