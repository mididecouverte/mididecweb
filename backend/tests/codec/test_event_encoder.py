from src.codec.event_json_encoder import EventJsonEncoder
from datetime import datetime, timedelta
import pytz
from src.events import Events
import json
from src.stores import MemoryStore
from src.users import Users


def test_complete_event_json_encoder():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)
    start = datetime.now(pytz.timezone("America/New_York"))
    dur = timedelta(hours=1)
    end = start + dur
    a = users.add("test@test.com", 'name', 'alias', 'psw')
    e = events.add("test", "test", 30, start, dur, 'test', 'test', 'test@test.com', 'test', a)
    a.validated = True
    e.register_attendee(a)
    e.add_attachment('../test/test.txt')
    jsonobj = EventJsonEncoder(e, True).encode('dict')
    assert jsonobj['event_id'] == "test"
    assert jsonobj['title'] == "test"
    assert jsonobj['description'] == "test"
    assert jsonobj['max_attendee'] == 30
    assert jsonobj['start'] == start.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['duration'] == dur.total_seconds()
    assert jsonobj['end'] == end.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['location'] == "test"
    assert jsonobj['organizer_name'] == "test"
    assert jsonobj['organizer_email'] == "test@test.com"
    assert jsonobj['owner_id'] == a.user_id
    assert 'create_date' in jsonobj
    assert len(jsonobj['attendees']) == 1
    assert len(jsonobj['attachments']) == 1
    assert jsonobj['attachments'][0] == 'test.txt'


def test_event_json_encoder():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)
    start = datetime.now(pytz.timezone("America/New_York"))
    dur = timedelta(hours=1)
    end = start + dur
    a = users.add("test@test.com", 'name', 'alias', 'psw')
    e = events.add("test", "test", 30, start, dur, 'test', 'test', 'test@test.com', 'test', a)
    a.validated = True
    e.register_attendee(a)
    e.add_attachment('../test/test.txt')
    jsonobj = EventJsonEncoder(e).encode('dict')
    assert jsonobj['event_id'] == "test"
    assert jsonobj['title'] == "test"
    assert jsonobj['description'] == "test"
    assert jsonobj['max_attendee'] == 30
    assert jsonobj['start'] == start.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['duration'] == dur.total_seconds()
    assert jsonobj['end'] == end.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['location'] == "test"
    assert jsonobj['organizer_name'] == "test"
    assert 'organizer_email' not in jsonobj
    assert jsonobj['owner_id'] == a.user_id
    assert 'create_date' in jsonobj
    assert len(jsonobj['attendees']) == 1
    assert len(jsonobj['attachments']) == 1
    assert jsonobj['attachments'][0] == 'test.txt'


def test_event_no_attendees_json_encoder():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)
    start = datetime.now(pytz.timezone("America/New_York"))
    dur = timedelta(hours=1)
    end = start + dur
    a = users.add("test@test.com", 'name', 'alias', 'psw')
    e = events.add("test", "test", 30, start, dur, 'test', 'test', 'test@test.com', 'test', a)
    a.validated = True
    e.register_attendee(a)
    e.add_attachment('../test/test.txt')
    jsonobj = EventJsonEncoder(e, show_attendee=False).encode('dict')
    assert jsonobj['event_id'] == "test"
    assert jsonobj['title'] == "test"
    assert jsonobj['description'] == "test"
    assert jsonobj['max_attendee'] == 30
    assert jsonobj['start'] == start.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['duration'] == dur.total_seconds()
    assert jsonobj['end'] == end.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['location'] == "test"
    assert jsonobj['organizer_name'] == "test"
    assert 'organizer_email' not in jsonobj
    assert jsonobj['owner_id'] == a.user_id
    assert 'create_date' in jsonobj
    assert 'attendees' not in jsonobj
    assert len(jsonobj['attachments']) == 1
    assert jsonobj['attachments'][0] == 'test.txt'


def test_event_no_attachments_json_encoder():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)
    start = datetime.now(pytz.timezone("America/New_York"))
    dur = timedelta(hours=1)
    end = start + dur
    a = users.add("test@test.com", 'name', 'alias', 'psw')
    e = events.add("test", "test", 30, start, dur, 'test', 'test', 'test@test.com', 'test', a)
    a.validated = True
    e.register_attendee(a)
    e.add_attachment('../test/test.txt')
    jsonobj = EventJsonEncoder(e, show_attendee=False, show_attachments=False).encode('dict')
    assert jsonobj['event_id'] == "test"
    assert jsonobj['title'] == "test"
    assert jsonobj['description'] == "test"
    assert jsonobj['max_attendee'] == 30
    assert jsonobj['start'] == start.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['duration'] == dur.total_seconds()
    assert jsonobj['end'] == end.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['location'] == "test"
    assert jsonobj['organizer_name'] == "test"
    assert 'organizer_email' not in jsonobj
    assert jsonobj['owner_id'] == a.user_id
    assert 'create_date' in jsonobj
    assert 'attendees' not in jsonobj
    assert 'attachments' not in jsonobj


def test_complete_event_json_encoder_string():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)
    start = datetime.now(pytz.timezone("America/New_York"))
    dur = timedelta(hours=1)
    end = start + dur
    a = users.add("test@test.com", 'name', 'alias', 'psw')
    e = events.add("test", "test", 30, start, dur, 'test', 'test', 'test@test.com', 'test', a)
    a.validated = True
    e.register_attendee(a)
    e.add_attachment('../test/test.txt')
    jsonstr = EventJsonEncoder(e, True).encode('string')
    assert type(jsonstr) == str
    jsonobj = json.loads(jsonstr)
    assert jsonobj['event_id'] == "test"
    assert jsonobj['title'] == "test"
    assert jsonobj['description'] == "test"
    assert jsonobj['max_attendee'] == 30
    assert jsonobj['start'] == start.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['duration'] == dur.total_seconds()
    assert jsonobj['end'] == end.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['location'] == "test"
    assert jsonobj['organizer_name'] == "test"
    assert jsonobj['organizer_email'] == "test@test.com"
    assert jsonobj['owner_id'] == a.user_id
    assert 'create_date' in jsonobj
    assert len(jsonobj['attendees']) == 1
    assert len(jsonobj['attachments']) == 1
    assert jsonobj['attachments'][0] == 'test.txt'


def test_event_json_encoder_string():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)
    start = datetime.now(pytz.timezone("America/New_York"))
    dur = timedelta(hours=1)
    end = start + dur
    a = users.add("test@test.com", 'name', 'alias', 'psw')
    e = events.add("test", "test", 30, start, dur, 'test', 'test', 'test@test.com', 'test', a)
    a.validated = True
    e.register_attendee(a)
    e.add_attachment('../test/test.txt')
    jsonstr = EventJsonEncoder(e).encode('string')
    assert type(jsonstr) == str
    jsonobj = json.loads(jsonstr)
    assert jsonobj['event_id'] == "test"
    assert jsonobj['title'] == "test"
    assert jsonobj['description'] == "test"
    assert jsonobj['max_attendee'] == 30
    assert jsonobj['start'] == start.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['duration'] == dur.total_seconds()
    assert jsonobj['end'] == end.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['location'] == "test"
    assert jsonobj['organizer_name'] == "test"
    assert 'organizer_email' not in jsonobj
    assert jsonobj['owner_id'] == a.user_id
    assert 'create_date' in jsonobj
    assert len(jsonobj['attendees']) == 1
    assert len(jsonobj['attachments']) == 1
    assert jsonobj['attachments'][0] == 'test.txt'


def test_event_no_attendees_json_encoder_string():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)
    start = datetime.now(pytz.timezone("America/New_York"))
    dur = timedelta(hours=1)
    end = start + dur
    a = users.add("test@test.com", 'name', 'alias', 'psw')
    e = events.add("test", "test", 30, start, dur, 'test', 'test', 'test@test.com', 'test', a)
    a.validated = True
    e.register_attendee(a)
    e.add_attachment('../test/test.txt')
    jsonstr = EventJsonEncoder(e, show_attendee=False).encode('string')
    assert type(jsonstr) == str
    jsonobj = json.loads(jsonstr)
    assert jsonobj['event_id'] == "test"
    assert jsonobj['title'] == "test"
    assert jsonobj['description'] == "test"
    assert jsonobj['max_attendee'] == 30
    assert jsonobj['start'] == start.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['duration'] == dur.total_seconds()
    assert jsonobj['end'] == end.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['location'] == "test"
    assert jsonobj['organizer_name'] == "test"
    assert 'organizer_email' not in jsonobj
    assert jsonobj['owner_id'] == a.user_id
    assert 'create_date' in jsonobj
    assert 'attendees' not in jsonobj
    assert len(jsonobj['attachments']) == 1
    assert jsonobj['attachments'][0] == 'test.txt'


def test_event_no_attachments_json_encoder_string():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)
    start = datetime.now(pytz.timezone("America/New_York"))
    dur = timedelta(hours=1)
    end = start + dur
    a = users.add("test@test.com", 'name', 'alias', 'psw')
    e = events.add("test", "test", 30, start, dur, 'test', 'test', 'test@test.com', 'test', a)
    a.validated = True
    e.register_attendee(a)
    e.add_attachment('../test/test.txt')
    jsonstr = EventJsonEncoder(e, show_attendee=False, show_attachments=False).encode('string')
    assert type(jsonstr) == str
    jsonobj = json.loads(jsonstr)
    assert jsonobj['event_id'] == "test"
    assert jsonobj['title'] == "test"
    assert jsonobj['description'] == "test"
    assert jsonobj['max_attendee'] == 30
    assert jsonobj['start'] == start.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['duration'] == dur.total_seconds()
    assert jsonobj['end'] == end.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert jsonobj['location'] == "test"
    assert jsonobj['organizer_name'] == "test"
    assert 'organizer_email' not in jsonobj
    assert jsonobj['owner_id'] == a.user_id
    assert 'create_date' in jsonobj
    assert 'attendees' not in jsonobj
    assert 'attachments' not in jsonobj
