export default [
  { exact: false, path: '/login', component: 'login' },
  {
    exact: false,
    path: '/',
    component: '@/layouts/index',
    routes: [
      { exact: true, path: '/', component: '@/pages/index' },
      { exact: true, path: '/home', component: 'index' },
      { exact: true, path: '/ability/dict', component: 'ability/dict/index' },
      { exact: true, path: '/ability/manage', component: 'ability/manage/index' },
      { exact: true, path: '/ability/service', component: 'ability/service/index' },
    ],
  },
]