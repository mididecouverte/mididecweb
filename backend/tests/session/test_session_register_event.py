from datetime import datetime, timedelta
import pytz
from src.events import Events
from src.event import ATTENDEE_LIST, ALREADY_ATTENDEE_LIST
from src.event import WAITING_LIST, ALREADY_WAITING_LIST
from src.users import Users
from src.stores import MemoryStore
from src.session import Session


def test_register_event():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)

    params = {}
    params['name'] = 'name'
    params['email'] = 'email'
    params['phone'] = 'phone'
    params['useemail'] = True
    params['usesms'] = True

    session = Session(params, events, users, '')

    start = datetime.now(pytz.timezone("America/New_York"))
    dur = timedelta(hours=1)
    events.add('test', 'test', 30, start, dur, 'test', 'test',
               'test@test.com', 'test')
    result_dict = session.register_event('')
    assert not result_dict
    result_dict = session.register_event('test')
    assert result_dict
    assert result_dict['result'] == ATTENDEE_LIST
    event = events.get('test')
    assert len(event.attendees) == 1
    result_dict = session.register_event('test')
    assert result_dict
    assert result_dict['result'] == ALREADY_ATTENDEE_LIST
    event = events.get('test')
    assert len(event.attendees) == 1


def test_register_event_bad_name():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)

    params = {}
    params['email'] = 'email'
    params['phone'] = 'phone'
    params['useemail'] = True
    params['usesms'] = True

    session = Session(params, events, users, '')

    start = datetime.now(pytz.timezone("America/New_York"))
    dur = timedelta(hours=1)
    events = events.add('test', 'test', 30, start, dur, 'test', 'test',
                        'test@test.com', 'test')
    result_dict = session.register_event('test')
    assert not result_dict


def test_register_event_bad_email():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)

    params = {}
    params['name'] = 'name'
    params['phone'] = 'phone'
    params['useemail'] = True
    params['usesms'] = True

    session = Session(params, events, users, '')

    start = datetime.now(pytz.timezone("America/New_York"))
    dur = timedelta(hours=1)
    events = events.add('test', 'test', 30, start, dur, 'test', 'test',
                        'test@test.com', 'test')
    result_dict = session.register_event('test')
    assert not result_dict


def test_register_event_waiting():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)

    params = {}
    params['name'] = 'name'
    params['email'] = 'email'
    params['phone'] = 'phone'
    params['useemail'] = True
    params['usesms'] = True

    session = Session(params, events, users, '')

    start = datetime.now(pytz.timezone("America/New_York"))
    dur = timedelta(hours=1)
    events.add('test', 'test', 1, start, dur, 'test', 'test',
               'test@test.com', 'test')
    result_dict = session.register_event('test')
    assert result_dict
    event = events.get('test')
    assert len(event.attendees) == 1

    params = {}
    params['name'] = 'name2'
    params['email'] = 'email2'
    params['phone'] = 'phone'
    params['useemail'] = True
    params['usesms'] = True

    session = Session(params, events, users, '')
    result_dict = session.register_event('test')
    assert result_dict
    assert result_dict['result'] == WAITING_LIST
    event = events.get('test')
    assert len(event.attendees) == 1
    assert len(event.waiting_attendees) == 1
    result_dict = session.register_event('test')
    assert result_dict
    assert result_dict['result'] == ALREADY_WAITING_LIST
    event = events.get('test')
    assert len(event.attendees) == 1
    assert len(event.waiting_attendees) == 1
