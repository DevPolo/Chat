import React from 'react';
import moment from 'moment';
import {
  Comment,
  CommentAvatar,
  CommentContent,
  CommentAuthor,
  CommentMetadata,
  CommentText,
  Image
} from 'semantic-ui-react';

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? 'message__self' : '';
};

const isImage = message => {
  return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
};

const timeFromNow = timestamp => moment(timestamp).fromNow();

const Message = ({ message, user }) => (
  <Comment>
    <CommentAvatar src={message.user.avatar} />
    <CommentContent className={isOwnMessage(message, user)}>
      <CommentAuthor as='a'>{message.user.name}</CommentAuthor>
      <CommentMetadata>{timeFromNow(message.timestamp)}</CommentMetadata>

      {isImage(message) ? (
        <Image src={message.image} className='message__image' />
      ) : (
        <CommentText>{message.content}</CommentText>
      )}
    </CommentContent>
  </Comment>
);

export default Message;
