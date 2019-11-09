import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/Home'
import Auth from '@/pages/auth/Auth'
import Setting from '@/pages/setting/Setting'
import Rrinting from '@/pages/Printing/Printing'
Vue.use(Router)

export default new Router({
    routes: [{
        path: '*',
        redirect: '/Home'
    }, {
        path: '/Home',
        name: 'Home',
        component: Home
    },
    {
        path: '/auth',
        name: 'Auth',
        component: Auth
    },
    {
        path: '/Printing',
        name: 'Printing',
        component: Rrinting
    },
    {
        path: '/setting',
        name: 'Setting',
        component: Setting
    }
    ]
})
