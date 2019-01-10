import React from 'react';
import moment from 'moment';
import {
  Comment,
  CommentAvatar,
  CommentContent,
  CommentAuthor,
  CommentMetadata,
  CommentText
} from 'semantic-ui-react';

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? 'message__self' : '';
};

const timeFromNow = timestamp => moment(timestamp).fromNow();

const Message = ({ message, user }) => (
  <Comment>
    <CommentAvatar src={message.user.avatar} />
    <CommentContent className={isOwnMessage(message, user)}>
      <CommentAuthor as='a'>{message.user.name}</CommentAuthor>
      <CommentMetadata>{timeFromNow(message.timestamp)}</CommentMetadata>
      <CommentText>{message.content}</CommentText>
    </CommentContent>
  </Comment>
);

export default Message;
