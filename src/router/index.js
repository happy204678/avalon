import Vue from 'vue'
import Router from 'vue-router'

import avalon_hall from '@/views/avalon/index'
import avalon_game from '@/views/avalon/game'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'avalon_hall',
      component: avalon_hall,
      meta: { requireAuth: true }
    },
    {
      path: '/game',
      name: 'avalon_game',
      component: avalon_game,
      meta: { requireAuth: true }
    }
  ]
})
/*
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    const isLogin = store.getters.authToken
    if (!isLogin) {
      next({ path: '/login' })
    } else {
      next()
    }
  } else {
    next()
  }
})
*/
export default router
