import { history } from 'umi'
import store from 'store'

// export function render(oldRender: any) {
//   if (store.get('token')) {
//     oldRender()
//   } else {
//     history.push('/login')
//     oldRender()
//   }
// }

export function onRouteChange({ location, action }: any) {
  if (location.pathname === '/login') return
  if (!store.get('token')) history.push('/login')
}