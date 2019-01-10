import React, { Component } from 'react';
import firebase from '../../firebase';
import md5 from 'md5';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
  GridColumn,
  FormInput
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: [],
      loading: false,
      usersRef: firebase.database().ref('users')
    };
  }

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: 'Fill in all fields' };
      this.setState({
        errors: errors.concat(error)
      });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: 'Invalid password' };
      this.setState({
        errors: errors.concat(error)
      });
      return false;
    } else {
      // form valid
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    if (this.isFormValid(this.state)) {
      this.setState({
        errors: [],
        loading: true
      });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log('user saved');
                this.setState({
                  loading: false,
                  errors: []
                });
              });
            })
            .catch(err => {
              console.log(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false
              });
            });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
    }
  };

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  handleInputError = (errors, input) => {
    return errors.some(error => error.message.toLowerCase().includes(input))
      ? 'error'
      : '';
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;

    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <GridColumn style={{ maxWidth: 450 }}>
          <Header as='h1' icon color='orange' textAlign='center'>
            <Icon name='puzzle piece' color='orange' />
            Register
          </Header>
          <Form onSubmit={this.handleSubmit} size='large'>
            <Segment>
              <FormInput
                fluid
                name='username'
                icon='user'
                iconPosition='left'
                placeholder='Username'
                onChange={this.handleChange}
                value={username}
                type='text'
              />

              <FormInput
                fluid
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder='Email Adress'
                onChange={this.handleChange}
                value={email}
                className={this.handleInputError(errors, 'email')}
                type='email'
              />

              <FormInput
                fluid
                name='password'
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                onChange={this.handleChange}
                value={password}
                className={this.handleInputError(errors, 'password')}
                type='password'
              />

              <FormInput
                fluid
                name='passwordConfirmation'
                icon='repeat'
                iconPosition='left'
                placeholder='Password Confirmation'
                onChange={this.handleChange}
                value={passwordConfirmation}
                className={this.handleInputError(errors, 'password')}
                type='password'
              />
            </Segment>

            <Button
              disabled={loading}
              className={loading ? 'loading' : ''}
              color='orange'
              fluid
              size='large'
            >
              Submit
            </Button>
          </Form>
          {this.state.errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(this.state.errors)}
            </Message>
          )}
          <Message>
            Already a user? <Link to='/login'>Login</Link>
          </Message>
        </GridColumn>
      </Grid>
    );
  }
}

export default Register;
