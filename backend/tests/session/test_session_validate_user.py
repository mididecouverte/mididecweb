from src.users import Users
from src.user import USER_ACCESS_MANAGER
from src.stores import MemoryStore
from src.session import Session


def test_validate_user_info():
    store = MemoryStore()
    params = {}
    params['email'] = 'email'
    params['alias'] = 'alias'
    session = Session(params, store, '')

    validation_dict = session.validate_user_info()
    assert validation_dict
    assert 'emailok' in validation_dict
    assert validation_dict['emailok']
    assert 'aliasok' in validation_dict
    assert validation_dict['aliasok']


def test_invalid_validate_user_info():
    store = MemoryStore()
    users = Users(store)
    users.add('email', 'name', 'alias', 'password', 'phone', True, True,
              access=USER_ACCESS_MANAGER, user_id='test')
    params = {}
    params['email'] = 'email'
    params['alias'] = 'alias'
    session = Session(params, store, '')

    validation_dict = session.validate_user_info()
    assert validation_dict
    assert 'emailok' in validation_dict
    assert not validation_dict['emailok']
    assert 'aliasok' in validation_dict
    assert not validation_dict['aliasok']


def test_invalid_email_validate_user_info():
    store = MemoryStore()
    users = Users(store)
    users.add('email', 'name', 'alias', 'password', 'phone', True, True,
              access=USER_ACCESS_MANAGER, user_id='test')
    params = {}
    params['email'] = 'email'
    params['alias'] = 'alias2'
    session = Session(params, store, '')

    validation_dict = session.validate_user_info()
    assert validation_dict
    assert 'emailok' in validation_dict
    assert not validation_dict['emailok']
    assert 'aliasok' in validation_dict
    assert validation_dict['aliasok']


def test_invalid_alias_validate_user_info():
    store = MemoryStore()
    users = Users(store)
    users.add('email', 'name', 'alias', 'password', 'phone', True, True,
              access=USER_ACCESS_MANAGER, user_id='test')
    params = {}
    params['email'] = 'email2'
    params['alias'] = 'alias'
    session = Session(params, store, '')

    validation_dict = session.validate_user_info()
    assert validation_dict
    assert 'emailok' in validation_dict
    assert validation_dict['emailok']
    assert 'aliasok' in validation_dict
    assert not validation_dict['aliasok']
