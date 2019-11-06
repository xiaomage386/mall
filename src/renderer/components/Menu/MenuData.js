export default {
    'list': [
        {
            'entity': {
                'id': 1,
                'parentMenuId': 0,
                'name': 'systemManage',
                'icon': 'icon icon-index',
                'alias': '首页',
                'state': 'ENABLE',
                'sort': 0,
                'route': '/mainWindow',
                'value': '/mainWindow',
                'type': 'NONE',
                'discription': '用于系统管理的菜单',
                'createUserId': 1
            }
        },
 /*        {
            'entity': {
                'id': 0,
                'parentMenuId': 0,
                'name': 'userManage',
                'icon': 'icon icon-play',
                'alias': '流速-容量测试',
                'state': 'ENABLE',
                'sort': 1,
                'route': '/testData',
                'value': '/testData',
                'type': 'NONE',
                'discription': '用于用户管理的菜单',
                'createUserId': 1
            }
        }, */
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
            'alias': '分类',
            'state': 'ENABLE',
            'sort': 1,
            'route': '/mainWindow/setting',
            'value': '/mainWindow/setting',
            'type': 'NONE',
            'discription': '用于用户管理的菜单',
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
