import React, { Component } from 'react';
import {
  Icon,
  Segment,
  Header,
  HeaderSubheader,
  Input
} from 'semantic-ui-react';

class MessagesHeader extends Component {
  render() {
    return (
      <Segment clearing>
        {/* Channel Title */}
        <Header fluid='true' as='h2' floated='left' style={{ marginBottom: 0 }}>
          <span>
            Channel
            <Icon name={'star outline'} color='black' />
          </span>
          <HeaderSubheader>2 Users</HeaderSubheader>
        </Header>

        {/* Channel Search Input */}
        <Header floated='right'>
          <Input
            size='mini'
            icon='search'
            name='searchTerm'
            placeholder='Search Messages'
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
