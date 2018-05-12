import React , { Component, PropTypes } from 'react'
import { browserHistory} from 'react-router'
import jquery from 'jquery'
import createHistory from "history/createHashHistory"
import User from './user'
import { Button, Form, FormGroup, Label, Input, Alert, Card, CardTitle, FormFeedback } from 'reactstrap';

const history = createHistory();

class UpdateUser extends React.Component{
        constructor(props) {
                super(props);
                this.state = {
                      valid: true,
                      validation: {
                              emailok: true,
                              aliasok: true
                      },
                      alert: {
                              visible: false,
                              message: '',
                              color: 'success'
                          },
                      values: { name: '',
                                email: '',
                                password: '',
                                alias: '',
                                phone: '',
                                useemail: false,
                                usesms: false,
                                profile: '',
                        }
                };
                var user = User.getSession();
                jquery.ajax({
                type: 'GET',
                url: "/mididec/api/v1.0/users/"+ this.props.match.params.id+'?loginkey='+user.loginkey,
                success: this.success.bind(this),
                error: this.error.bind(this),
                contentType: "application/json",
                dataType: 'json'
                });
                this.onCancel = this.onCancel.bind(this);
                this.onUpdate = this.onUpdate.bind(this);
                this.updateSuccess = this.updateSuccess.bind(this);
                this.updateError = this.updateError.bind(this);
                this.validateSuccess = this.validateSuccess.bind(this);
                this.validateError = this.validateError.bind(this);
                this.onChange = this.onChange.bind(this);
                this.onCheck = this.onCheck.bind(this);
                this.onDismiss = this.onDismiss.bind(this);
        }

        componentDidMount(){
        }

        componentWillUnmount(){
        }

        onDismiss() {
                this.state.alert.visible = false;
                this.setState(this.state);
        }

        success(data){
                this.state.values = data.user;
                this.state.values.password = '';
                this.state.invalid = false;
                this.setState(this.state);
        }

        error(data){
                this.showAlert('Cette événement n\'est pas disponible!', 'danger');
        }

        onCancel(e) {
                history.replace("/");
        }

        onCheck(e){
                this.state.values[e.target.id] = e.target.checked;
                console.debug(e.target.id, e.target.checked, this.state.values);
                this.setState(this.state);
        }

        onChange(e) {
                this.state.values[e.target.id] = e.target.value;
                console.debug(e, this.state.values);
                this.validateUser();
                this.setState(this.state);
        }

        validateUser(){
                var user = User.getSession();
                jquery.ajax({
                type: 'POST',
                url: "/mididec/api/v1.0/users/validate?loginkey=" + user.loginkey,
                data: JSON.stringify (this.state.values),
                success: this.validateSuccess,
                error: this.validateError,
                contentType: "application/json",
                dataType: 'json'
                });
        }

        validateSuccess(data){
                this.state.validation = data;
                this.state.valid = false;
                if (data.emailok && data.aliasok)
                var at = this.state.values.email.indexOf('@');
                var dot = this.state.values.email.indexOf('.');
                if (this.state.values.name != '' &&
                    this.state.values.email != '' &&
                    this.state.values.alias != '' &&
                    at != -1 && dot != -1 && at < dot &&
                    dot+1 < this.state.values.email.length )
                        this.state.valid = true;
                this.setState(this.state);
        }

        validateError(data){

        }

        onUpdate() {
            jquery.ajax({
            type: 'POST',
            url: "/mididec/api/v1.0/users/" + this.props.match.params.id,
            data: JSON.stringify (this.state.values),
            success: this.updateSuccess,
            error: this.updateError,
            contentType: "application/json",
            dataType: 'json'
            });
        }

        updateSuccess(data){
            this.showAlert('Update success', 'success')
        }

        updateError(data){
                this.showAlert('Une erreur est survenue lors de l\'update', 'danger')
        }

        showAlert(message, color='success'){
                this.state.alert.color = color;
                this.state.alert.visible = true;
                this.state.alert.message = message;
                this.setState(this.state);
        }

        render(){
                var emailErrorMessage = "";
                if (!this.state.validation.emailok)
                        emailErrorMessage = <FormFeedback>Désolé ce courriel est déja utilisé</FormFeedback>
                var aliasErrorMessage = "";
                if (!this.state.validation.aliasok)
                        aliasErrorMessage = <FormFeedback>Désolé cet alias est déja utilisé</FormFeedback>
                return (
                        <div className='updateuser'>
                                <Alert color={this.state.alert.color} isOpen={this.state.alert.visible} toggle={this.onDismiss}>
                                        {this.state.alert.message}
                                </Alert>
                                <Card body className='updateuser-card'>
                                        <CardTitle>Profile</CardTitle>

                                        <Form className='updateuser-form'>
                                                <FormGroup className='name'>
                                                        <Label for="name">Nom <font size="3" color="red">*</font></Label>
                                                        <Input onChange={this.onChange} autocomplete='name' type='text' name="name" id="name" placeholder="Nom" value={this.state.values.name} />
                                                </FormGroup>
                                                <FormGroup className='email'>
                                                        <Label for="email">Courriel <font size="3" color="red">*</font></Label>
                                                        <div>
                                                                <Input invalid={!this.state.validation.emailok} autocomplete='email' onChange={this.onChange} type='email' name="email" id="email" placeholder="test@test.com" value={this.state.values.email} />
                                                                {emailErrorMessage}
                                                        </div>
                                                </FormGroup>
                                                <FormGroup className='alias'>
                                                        <Label for="alias">Alias <font size="3" color="red">*</font></Label>
                                                        <div>
                                                                <Input invalid={!this.state.validation.aliasok} autocomplete='alias' onChange={this.onChange} type='text' name="alias" id="alias" placeholder="alias" value={this.state.values.alias} />
                                                                {aliasErrorMessage}
                                                        </div>
                                                </FormGroup>
                                                <FormGroup className='password'>
                                                        <Label for="password">Mot de passe</Label>
                                                        <Input onChange={this.onChange} autocomplete='current-password' type='password' name="password" id="password" value={this.state.values.password} />
                                                </FormGroup>
                                                <FormGroup className='phone'>
                                                        <Label for="phone">Cell.</Label>
                                                        <div><Input onChange={this.onChange} autocomplete='tel' type='text' name="phone" id="phone" placeholder="+15551234567" value={this.state.values.phone} /></div>
                                                </FormGroup>
                                                <FormGroup className='profile'>
                                                        <Label for="profile">Profile</Label>
                                                        <div>
                                                                <Input autocomplete='profile' onChange={this.onChange} type='text' name="profile" id="profile" placeholder="profile" value={this.state.values.profile} />
                                                        </div>
                                                </FormGroup>
                                                <FormGroup check>
                                                        <Label>
                                                                <Input onChange={this.onCheck} type='checkbox' id="useemail" checked={this.state.values.useemail} />{' '}
                                                                Recevoir alerte par courriel
                                                        </Label>
                                                </FormGroup>
                                                <FormGroup check>
                                                        <Label>
                                                                <Input onChange={this.onCheck} type='checkbox' id="usesms" checked={this.state.values.usesms} />
                                                                Recevoir alerte par sms
                                                        </Label>
                                                </FormGroup>
                                                <Button className='bt-update' color="primary" onClick={this.onUpdate} disabled={!this.state.valid}>Sauvegarder</Button>
                                                <Button color="secondary" onClick={this.onCancel} >Cancel</Button>
                                        </Form>
                                </Card>
                        </div>)
        }
}

module.exports = UpdateUser;
