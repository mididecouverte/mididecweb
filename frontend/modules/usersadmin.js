import React from 'react'
import jquery from 'jquery'
import User from './user'
import UserSummary from './usersummary'
import Errors from './errors'
import { Table, NavLink, Card, CardTitle, CardText, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import createHistory from "history/createHashHistory"
import Text from './localization/text'
import removeAccents from 'remove-accents'

const history = createHistory();

class UsersAdmin extends React.Component{
        constructor(props) {
                super(props);
                this.state = {users: {count:0, users:[]}, invalid: true, modal: false};
                this.onEdit = this.onEdit.bind(this);
                this.onDelete = this.onDelete.bind(this);
                this.rmSuccess = this.rmSuccess.bind(this);
                this.rmError = this.rmError.bind(this);
                this.onAccept = this.onAccept.bind(this);
                this.onRefuse = this.onRefuse.bind(this);
                this.updateUsers();

        }

        updateUsers(){
                var user = User.getSession();
                jquery.ajax({
                type: 'GET',
                url: "/mididec/api/v1.0/users?loginkey="+user.loginkey,
                success: this.success.bind(this),
                error: this.error.bind(this),
                contentType: "application/json",
                dataType: 'json'
                });
        }

        success(data){
                this.state.users = data.users;
                this.state.invalid = false;
                this.setState(this.state);
        }

        error(data){
            var errorCode = data.responseJSON.code;
            this.showAlert(Errors.getErrorMessage(errorCode), 'danger');
        }

        onEdit(user){
                history.push("/users/"+user.user_id+"/update");
        }

        onDelete(user){
                this.state.modal = true;
                this.state.modalUser = user;
                this.setState(this.state);
        }

        rmSuccess(data){
                this.showAlert(Text.text.user_delete_success, 'success');
                this.updateUsers();
        }

        rmError(data){
                var errorCode = data.responseJSON.code;
                this.showAlert(Errors.getErrorMessage(errorCode), 'danger');
        }

        onAccept(){
                var loguser = User.getSession();
                if (loguser.user_id != this.state.modalUser.user_id) {
                        jquery.ajax({
                        type: 'DELETE',
                        url: "/mididec/api/v1.0/users/"+this.state.modalUser.user_id,
                        data: JSON.stringify ({loginkey: loguser.loginkey}),
                        success: this.rmSuccess,
                        error: this.rmError,
                        contentType: "application/json",
                        dataType: 'json'
                        });
                }
                this.state.modal = false;
                this.setState(this.state);
        }

        onRefuse(){
                this.state.modal = false;
                this.state.modalUser = null;
                this.setState(this.state);
        }

        showAlert(message, color='success'){
                this.props.onError(message, color);
        }

        render(){
                this.state.users.users.sort(function(a, b){
                                                var x = removeAccents(a.name.toLowerCase());
                                                var y = removeAccents(b.name.toLowerCase());
                                                if (x < y) {return -1;}
                                                if (x > y) {return 1;}
                                                return 0;
                                            });
                var users = this.state.users.users.map(user =>
                  <UserSummary key={user.user_id} user={user} onDelete={this.onDelete} onEdit={this.onEdit}/>
                );
                var modalTitle = "";
                if (this.state.modalUser)
                        modalTitle = this.state.modalUser.name;
                return (
                        <div className='usersadmin'>
                            <Card body className='users-card'>
                                <CardTitle>{Text.text.users}</CardTitle>
                                {users}
                            </Card>
                            <Modal isOpen={this.state.modal}>
                                    <ModalHeader toggle={this.toggle}>{modalTitle}</ModalHeader>
                                    <ModalBody>
                                            {Text.text.user_delete_confirmation}
                                    </ModalBody>
                                    <ModalFooter>
                                            <Button color="primary" onClick={this.onAccept}>{Text.text.yes}</Button>{' '}
                                            <Button color="secondary" onClick={this.onRefuse}>{Text.text.no}</Button>
                                    </ModalFooter>
                            </Modal>
                        </div>)
        }
}

module.exports = UsersAdmin;
