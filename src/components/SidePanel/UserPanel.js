import React, { Component } from 'react';
import firebase from 'firebase';
import {
  Grid,
  GridColumn,
  GridRow,
  Header,
  HeaderContent,
  Icon,
  Dropdown,
  Image
} from 'semantic-ui-react';

class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.currentUser
    };
  }

  dropdownOptions = () => [
    {
      key: 'user',
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: 'avatar',
      text: <span>Change Avatar</span>
    },
    {
      key: 'signout',
      text: <span onClick={this.handleSignout}>Sign Out</span>
    }
  ];

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('Signed out!'));
  };

  render() {
    const { user } = this.state;

    return (
      <Grid style={{ background: '#4c3c4c' }}>
        <GridColumn>
          {/* App Header */}
          <GridRow style={{ padding: '1.2rem', margin: 0 }}>
            <Header inverted floated='left' as='h2'>
              <Icon name='code' />
              <HeaderContent>DevChat</HeaderContent>
            </Header>
          </GridRow>

          {/* User Dropdown */}
          <Header style={{ padding: '0.25em' }} as='h4' inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={user.photoURL} spaced='right' avatar />
                  {user.displayName}
                </span>
              }
              options={this.dropdownOptions()}
            />
          </Header>
        </GridColumn>
      </Grid>
    );
  }
}

export default UserPanel;

document.get;
