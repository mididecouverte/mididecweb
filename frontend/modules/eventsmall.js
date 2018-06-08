import React from 'react'
import DateFormater from './dateformater'
import User from './user'
import RegisterPanel from './registerpanel'
import RegisterStatusPanel from './registerstatuspanel'
import AttendeeIcon from './attendeeicon'
import Text from './localization/text'

class EventSmall extends React.Component{
        constructor(props) {
                super(props);
                this._start = new DateFormater(this.props.event.start);
                this._end = new DateFormater(this.props.event.end);
                this.onCancel = this.onCancel.bind(this);
                this.onRegister = this.onRegister.bind(this);
        }

        onCancel() {
                this.props.onCancel();
        }

        onRegister(){
                this.props.onRegister();
        }

        render(){
                var user = User.getSession();
                var dateText = this._start.getDateText();
                var timeText = this._start.getTimeText() + ' à ';
                timeText += this._end.getTimeText();
                var icalurl = '/mididec/api/v1.0/events/' + this.props.event.event_id + '/ical';
                var attendees = "";
                if (user)
                    attendees = this.props.event.attendees.map((attendee) =>
                            <AttendeeIcon key={attendee.user_id} attendee={attendee} className='attendee-icon'/>
                    );
                var registerPanel = <RegisterPanel onRegister={this.onRegister} disabled={this.props.disableRegister}/>
                if (this.props.event.find_attendee(user))
                    registerPanel = <RegisterStatusPanel status='attending' onCancel={this.onCancel} disabled={this.props.disableRegister} />
                else if (this.props.event.find_waiting(user))
                    registerPanel = <RegisterStatusPanel status='waiting' onCancel={this.onCancel} disabled={this.props.disableRegister}/>
                return (
                        <div className='eventsmall'>
                                <div className='title'>{this.props.event.title}</div>

                                <div className='detail'>
                                        <div className='detaillabel'> {Text.text.event_details_label} </div>
                                        <div className='description'>{this.props.event.description} </div>
                                </div>
                                <div className='register'>
                                        {registerPanel}
                                </div>
                                <div className='duration'>
                                        <img className='timeicon' src='res/drawables/time-icon.png'></img>
                                        <div className='timetext'>
                                                <div className='date'>{dateText}</div>
                                                <div className='time'>{timeText}</div>
                                                <a href={icalurl}>{Text.text.event_add_to_calendar_label}</a>
                                        </div>
                                </div>
                                <div className='location'>
                                        <img className='locationicon' src='res/drawables/location-icon.png'></img>
                                        <div className='locationtext'>
                                                {this.props.event.location}
                                        </div>
                                </div>
                                <div className='attendees-title'>{Text.text.event_attendees_label}</div>
                                <div className='attendeesgrid'>
                                        {attendees}
                                </div>
                        </div>);
        }
}

module.exports = EventSmall;
