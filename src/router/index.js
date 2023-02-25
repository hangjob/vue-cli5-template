import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'theme',
        component: () => import('@/layout/theme/index'),
        redirect: 'home',
        children: [
            {
                path: '/home', name: 'home', meta: {title: '首页'},
                component: () => import('@/html/web/views/home'),
            },
        ],
    },
    {
        path: '/login', name: 'login', meta: {title: '登录'},
        component: () => import('@/views/login/index'),
    },
]


const createRouterInit = ({base, routes}) => {
    console.log(routes)
    return createRouter({
        history: createWebHistory(base),
        routes,
    })
}

const setupRouter = (app, options) => {
    const {subName, base, ..._options} = Object.assign({routes: [], base: '/index/', subName: 'theme'}, options)
    const _routes = routes.find((item) => item.name === subName)
    _routes.children.push(..._options.routes)
    app.use(createRouterInit({routes, base}))
}


export default setupRouter;
