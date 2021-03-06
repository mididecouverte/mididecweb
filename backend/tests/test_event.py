from datetime import datetime, timedelta
import pytz
import pytest
from src.event import WAITING_LIST, ATTENDEE_LIST, ALREADY_ATTENDEE_LIST
from src.events import Events
from src.users import Users
from src.stores import MemoryStore


def test_event():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)
    start = datetime.now(pytz.timezone("America/New_York"))
    dur = timedelta(hours=1)
    end = start + dur
    u = users.add("test@test.com", 'name', 'alias', 'psw', 8)
    e = events.add('test', 'test', 30, start, dur, 'test', 'test',
                   'test@test.com', 'test', u)
    assert e.event_id == "test"
    assert e.title == "test"
    assert e.description == "test"
    assert e.max_attendee == 30
    assert e.start == start.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert e.duration == dur.total_seconds()
    assert e.end == end.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert e.location == "test"
    assert e.organizer_name == "test"
    assert e.organizer_email == "test@test.com"
    assert e.owner_id == u.user_id


def test_default_event():
    store = MemoryStore()
    events = Events(store)
    e = events.add("test", "test")
    start = datetime.strptime(e.start, "%Y-%m-%dT%H:%M:%SZ")
    dur = timedelta(seconds=e.duration)
    end = start + dur
    assert e.title == "test"
    assert e.description == "test"
    assert e.max_attendee == 20
    assert e.start == start.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert e.duration == dur.total_seconds()
    assert e.end == end.strftime("%Y-%m-%dT%H:%M:%SZ")
    assert e.location == ""
    assert e.organizer_name == ""
    assert e.organizer_email == ""
    assert e.event_id
    assert type(e.event_id) == str
    assert not e.owner_id


def test_register_attendee():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)
    e = events.add("test", "test")
    u = users.add("test@test.com", 'name', 'alias', 'psw', 8)
    res = e.register_attendee(u)
    assert len(e.attendees) == 1
    assert e.attendees[0].user_id == u.user_id
    assert res == ATTENDEE_LIST


def test_double_register_attendee():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)
    e = events.add("test", "test")
    u = users.add("test@test.com", 'name', 'alias', 'psw', 8)
    res1 = e.register_attendee(u)
    res2 = e.register_attendee(u)
    assert len(e.attendees) == 1
    assert e.attendees[0].user_id == u.user_id
    assert res1 == ATTENDEE_LIST
    assert res2 == ALREADY_ATTENDEE_LIST


def test_max_attendee():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)
    e = events.add("test", "test", max_attendee=1)
    u1 = users.add("test@test.com", 'name', 'alias', 'psw', 8)
    u2 = users.add("test2@test.com", 'name2', 'alias2', 'psw', 8)
    res1 = e.register_attendee(u1)
    res2 = e.register_attendee(u2)
    assert len(e.attendees) == 1
    assert e.attendees[0].user_id == u1.user_id
    assert res1 == ATTENDEE_LIST
    assert len(e.waiting_attendees) == 1
    assert e.waiting_attendees[0].user_id == u2.user_id
    assert res2 == WAITING_LIST


def test_cancel_register():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)
    e = events.add("test", "test", max_attendee=1)
    u1 = users.add("test@test.com", 'name', 'alias', 'psw', 8)
    u2 = users.add("test2@test.com", 'name2', 'alias2', 'psw', 8)
    res1 = e.register_attendee(u1)
    res2 = e.register_attendee(u2)
    assert len(e.attendees) == 1
    assert e.attendees[0].user_id == u1.user_id
    assert res1 == ATTENDEE_LIST
    assert len(e.waiting_attendees) == 1
    assert e.waiting_attendees[0].user_id == u2.user_id
    assert res2 == WAITING_LIST
    e.cancel_registration(u1)
    assert len(e.attendees) == 1
    assert len(e.waiting_attendees) == 0
    assert e.attendees[0].user_id == u2.user_id
    e.cancel_registration(u2)
    assert len(e.attendees) == 0
    assert len(e.waiting_attendees) == 0
    res1 = e.register_attendee(u1)
    res2 = e.register_attendee(u2)
    e.cancel_registration(u2)
    assert len(e.attendees) == 1
    assert len(e.waiting_attendees) == 0


def test_promote_waitings():
    store = MemoryStore()
    events = Events(store)
    users = Users(store)
    e = events.add("test", "test", max_attendee=3)
    for i in range(10):
        u1 = users.add("test@test.com"+str(i), 'name'+str(i), 'alias'+str(i), 'psw', 8)
        e.register_attendee(u1)
    e.max_attendee = 5
    e.promote_waitings(2)
    assert len(e.attendees) == 5


def test_add_attachment():
    store = MemoryStore()
    events = Events(store)
    e = events.add("test", "test")
    e.add_attachment('path')
    with pytest.raises(Exception):
        e.add_attachment('path')
    assert len(e.attachments) == 1
    assert e.attachments[0] == 'path'


def test_remove_attachment():
    store = MemoryStore()
    events = Events(store)
    e = events.add("test", "test", max_attendee=1)
    e.add_attachment('path')
    assert len(e.attachments) == 1
    with pytest.raises(Exception):
        e.remove_attachment('')
    assert len(e.attachments) == 1
    e.remove_attachment('path')
    assert len(e.attachments) == 0
   