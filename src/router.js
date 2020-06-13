import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/user/User.vue'
import Right from './components/right/Right.vue'
import Role from './components/right/Role.vue'
import Cate from './components/goods/Cate.vue'
// import aa from './components/aa.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        
        { path: '/login', component: Login },
        { path: '/home', component: Home, redirect: '/welcome', 
            children:[
                { path: '/welcome', component: Welcome },
                { path: '/users', component: User },
                { path: '/rights', component: Right },
                { path: '/roles', component: Role },
                { path: '/categories', component: Cate },

            ] 
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.path === "/login") return next()
    const tokenStr = window.sessionStorage.getItem("token")
    if (!tokenStr) return next("/login")
    next()
})

export default router