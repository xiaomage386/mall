import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/Home'
import Auth from '@/pages/auth/Auth'
import User from '@/pages/user/User'
import UserDetail from '@/pages/userDetail/UserDetail'
import Setting from '@/pages/setting/Setting'
import BronchusPrinting from '@/pages/bronchusPrinting/BronchusPrinting'
import RoutinePrinting from '@/pages/routinePrinting/RoutinePrinting'
import Report from '@/pages/report/Report'
import Rrinting from '@/pages/Printing/Printing'
Vue.use(Router)

export default new Router({
    routes: [{
        path: '*',
        redirect: '/mainWindow'
    },
    {
        path: '/mainWindow',
        name: 'MainWindow',
        component: require('@/pages/MainWindow.vue').default,
        children: [{
            path: '',
            name: 'Home',
            component: Home
        }, {
            path: 'user',
            name: 'User',
            component: User
        }, {
            path: 'userDetail',
            name: 'UserDetail',
            component: UserDetail
        }, {
            path: 'setting',
            name: 'Setting',
            component: Setting
        }, {
            path: 'report',
            name: 'Report',
            component: Report
        }
        ]
    },
    {
        path: '/auth',
        name: 'Auth',
        component: Auth
    },
    {
        path: '/bronchusPrinting',
        name: 'BronchusPrinting',
        component: BronchusPrinting
    },
    {
        path: '/Printing',
        name: 'Printing',
        component: Rrinting
    },
    {
        path: '/routinePrinting',
        name: 'RoutinePrinting',
        component: RoutinePrinting
    }
    ]
})
