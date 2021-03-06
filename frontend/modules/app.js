import React , { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { hashHistory } from 'react-router'
import { HashRouter , Link, Route } from 'react-router-dom'
import { browserHistory} from 'react-router'
import { Button, Form, FormGroup, Label, Input, Alert, Card, CardTitle } from 'reactstrap';
import Navbar from './navbar'
import Home from './home'
import Events from './events'
import CreateEvent from './createevent'
import UpdateEvent from './updateevent'
import CreateUser from './createuser'
import UpdateUser from './updateuser'
import UsersAdmin from './usersadmin'
import ResetUserPassword from './resetuserpassword'
import ChangeUserPassword from './changeuserpassword'
import EventsAdmin from './eventsadmin'
import Presence from './presence'
import Login from './login'
import Text from './localization/text'
import { BounceLoader } from 'react-spinners';

class App extends React.Component{
        constructor(props) {
                super(props);
                this.state = {
                      alert: {
                              visible: false,
                              message: '',
                              color: 'success',
                              refresh: false
                          },
                      spinners: {
                          loading: false,
                          color: '#CCC'
                      }
                };
                this.onError = this.onError.bind(this);
                this.refresh = this.refresh.bind(this);
                this.hideAlert = this.hideAlert.bind(this);
                this.onloading = this.onloading.bind(this);
        }

        onError(message, color){
                this.showAlert(message, color);
        }

        onloading(loading=true, color='#CCC') {
            this.state.spinners.loading = loading;
            this.state.spinners.color = color;
            this.setState(this.state);
        }

        refresh(){
                this.state.refresh = !this.state.refresh;
                this.setState(this.state);
        }

        hideAlert(){
                this.state.alert.visible = false;
                this.setState(this.state);
        }

        showAlert(message, color='success'){
                this.state.alert.color = color;
                this.state.alert.visible = true;
                this.state.alert.message = message;
                this.setState(this.state);
                setTimeout(this.hideAlert, 6000);
        }

        componentDidMount(){
        }

        componentWillUnmount(){
        }

        render(){
                return (
                        <div className='app'>
                                <Navbar prev='' next='' refresh={this.refresh}></Navbar>
                                <div className='error'>
                                        <Alert className='error' color={this.state.alert.color} isOpen={this.state.alert.visible} toggle={this.onDismiss} transitionappeartimeout={150} transitionappeartimeout={150}>
                                                {this.state.alert.message}
                                        </Alert>
                                </div>
                                <div className='spinners'>
                                    <BounceLoader color={this.state.spinners.color} loading={this.state.spinners.loading}/>
                                </div>
                                <div className='content'>
                                        <Route exact path="/" render={(props) => <Home {...props} onError={this.onError} onloading={this.onloading}/>} />
                                        <Route path="/login" render={(props) => <Login {...props} onError={this.onError} onloading={this.onloading}/>} />
                                        <Route exact path="/events/:id" render={(props) => <Events {...props} onError={this.onError} onloading={this.onloading}/>} />
                                        <Route path="/events/:id/update" render={(props) => <UpdateEvent {...props} onError={this.onError} onloading={this.onloading}/>} />
                                        <Route path="/createevent" render={(props) => <CreateEvent {...props} onError={this.onError} onloading={this.onloading}/>} />
                                        <Route path="/users/:id/update" render={(props) => <UpdateUser {...props} onError={this.onError} onloading={this.onloading}/>} />
                                        <Route path="/createuser" render={(props) => <CreateUser {...props} onError={this.onError} onloading={this.onloading}/>} />
                                        <Route path="/usersadmin" render={(props) => <UsersAdmin {...props} onError={this.onError} onloading={this.onloading}/>} />
                                        <Route path="/eventsadmin" render={(props) => <EventsAdmin {...props} onError={this.onError} onloading={this.onloading}/>} />
                                        <Route path="/resetpsw" render={(props) => <ResetUserPassword {...props} onError={this.onError} onloading={this.onloading}/>} />
                                        <Route path="/changepsw/:reqid" render={(props) => <ChangeUserPassword {...props} onError={this.onError} onloading={this.onloading}/>} />
                                        <Route path="/events/:id/presence" render={(props) => <Presence {...props} onError={this.onError} onloading={this.onloading}/>} />
                                </div>
                                <div className='footer'>
                                        <div className='footer-issue'>
                                                <a className='footer-issue-link' href='https://github.com/mididecouverte/mididecweb/issues/new' target="_blank">{Text.text.comments}</a>
                                        </div>
                                        <div className='footer-contrib'>
                                                <a className='footer-contrib-link' href='https://github.com/mididecouverte/mididecweb' target="_blank"><img src='res/drawables/GitHub-Mark-Light-32px.png' /></a>
                                        </div>
                                        <div className='footer-copyright'>
                                                © 2018 Mididecouverte
                                        </div>
                                </div>
                        </div>)
        }
}

module.exports = App;
