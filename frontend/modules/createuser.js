import React , { Component, PropTypes } from 'react'
import { browserHistory} from 'react-router'
import jquery from 'jquery'
import createHistory from "history/createHashHistory"
import User from './user'
import { Button, Form, FormGroup, Label, Input, Alert, Card, CardTitle, FormFeedback } from 'reactstrap';

const history = createHistory();

class CreateUser extends React.Component{
        constructor(props) {
                super(props);
                this.state = {
                      valid: false,
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
                                usesms: false
                        }
                };
                this.oncCreate = this.oncCreate.bind(this);
                this.createSuccess = this.createSuccess.bind(this);
                this.createError = this.createError.bind(this);
                this.validateSuccess = this.validateSuccess.bind(this);
                this.validateError = this.validateError.bind(this);
                this.onChange = this.onChange.bind(this);
        }

        componentDidMount(){
        }

        componentWillUnmount(){
        }

        onChange(e) {
                this.state.values[e.target.id] = e.target.value;
                this.validateUser();
                this.setState(this.state);
        }

        validateUser(){
                jquery.ajax({
                type: 'POST',
                url: "/mididec/api/v1.0/users/validate",
                data: JSON.stringify (this.state.values),
                success: this.validateSuccess,
                error: this.validateError,
                contentType: "application/json",
                dataType: 'json'
                });
        }

        validateSuccess(data){
                this.state.validation = data;
                if (data.emailok && data.aliasok)
                var at = this.state.values.email.indexOf('@');
                var dot = this.state.values.email.indexOf('.');
                if (this.state.values.name != '' &&
                    this.state.values.email != '' &&
                    this.state.values.password != '' &&
                    this.state.values.alias != '' &&
                    at != -1 && dot != -1 && at < dot &&
                    dot+1 < this.state.values.email.length )
                        this.state.valid = true;
                this.setState(this.state);
        }

        validateError(data){

        }

        oncCreate() {
            jquery.ajax({
            type: 'POST',
            url: "/mididec/api/v1.0/users",
            data: JSON.stringify (this.state.values),
            success: this.createSuccess,
            error: this.createError,
            contentType: "application/json",
            dataType: 'json'
            });
        }

        createSuccess(data){
            this.showAlert('Inscription success', 'success')
            history.replace("/login");
        }

        createError(data){
                this.showAlert('Une erreur est survenue lors de l\'inscription', 'danger')
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
                        <div className='createuser'>
                                <Alert color={this.state.alert.color} isOpen={this.state.alert.visible} toggle={this.onDismiss}>
                                        {this.state.alert.message}
                                </Alert>
                                <Card body className='createuser-card'>
                                        <CardTitle>S'inscrire</CardTitle>

                                        <Form className='createuser-form'>
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
                                                        <Label for="password">Mot de passe <font size="3" color="red">*</font></Label>
                                                        <Input onChange={this.onChange} autocomplete='current-password' type='password' name="password" id="password" value={this.state.values.password} />
                                                </FormGroup>
                                                <FormGroup className='phone'>
                                                        <Label for="phone">Cell.</Label>
                                                        <div><Input onChange={this.onChange} autocomplete='tel' type='text' name="phone" id="phone" placeholder="+15551234567" value={this.state.values.phone} /></div>
                                                </FormGroup>
                                                <FormGroup check  className='use'>
                                                        <Label>
                                                                <Input onChange={this.onChange} type='checkbox' value={this.state.values.useemail} />
                                                                Recevoir alerte par courriel
                                                        </Label>
                                                </FormGroup>
                                                <FormGroup check>
                                                        <Label>
                                                                <Input onChange={this.onChange} type='checkbox' value={this.state.values.usesms} />
                                                                Recevoir alerte par sms
                                                        </Label>
                                                </FormGroup>
                                                <Button color="primary" onClick={this.oncCreate} disabled={!this.state.valid}>S'inscrire</Button>{' '}
                                        </Form>
                                </Card>
                        </div>)
        }
}

module.exports = CreateUser;