export default {
    'list': [
        {
            'entity': {
                'id': 1,
                'parentMenuId': 0,
                'name': 'systemManage',
                'icon': 'icon icon-add-reservation',
                'alias': '新增预约补录',
                'state': 'ENABLE',
                'sort': 0,
                'route': '/Home',
                'value': '/Home',
                'type': 'NONE',
                'discription': '用于预约补录的菜单',
                'createUserId': 1
            }
        },
        {
            'entity': {
                'id': 2,
                'parentMenuId': 0,
                'name': 'userManage',
                'icon': 'icon icon-reservation',
                'alias': '查询预约列表',
                'state': 'ENABLE',
                'sort': 1,
                'route': '/Reserve',
                'value': '/Reserve',
                'type': 'NONE',
                'discription': '用于预约补录的菜单',
                'createUserId': 1
            }
        },
        {
            'entity': {
                'id': '',
                'parentMenuId': 0,
                'name': 'userManage',
                'icon': 'icon icon-navigation',
                'alias': '占位',
                'state': 'ENABLE',
                'sort': 1,
                'route': '',
                'value': '',
                'type': 'NONE',
                'discription': '占位',
                'createUserId': 1
            }
        }
    ],
    'setting': [{
        'entity': {
            'id': 100,
            'parentMenuId': 0,
            'name': 'userManage',
            'icon': 'icon icon-setting',
            'alias': '设置',
            'state': 'ENABLE',
            'sort': 1,
            'route': '/setting',
            'value': '/setting',
            'type': 'NONE',
            'discription': '用于预约补录的菜单',
            'createUserId': 1
        }
    }, {
        'entity': {
            'id': '',
            'parentMenuId': 0,
            'name': 'userManage',
            'icon': 'icon icon-navigation',
            'alias': '占位',
            'state': 'ENABLE',
            'sort': 1,
            'route': '',
            'value': '',
            'type': 'NONE',
            'discription': '占位',
            'createUserId': 1
        }
    }]
}
