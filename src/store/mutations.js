import * as types from './mutation-types'
import store from 'storejs' // store save as localStorage
// state
const state = {
  accountName: store.get('accountName') !== undefined ? store.get('accountName') : '',
  authToken: store.get('authToken') !== undefined ? store.get('authToken') : '',
  role: store.get('role') !== undefined ? store.get('role') : null,
}

// mutations
const mutations = {
  // action 發出 commit 會對應到 mutation 使用的是 Object key 方式
  // 在 mutation 改變 state（只有 mutation 可以改變！）
  [types.SET_ACCOUNTNAME] (state, payload) {
    state.accountName = payload
  },
  [types.SET_AUTHTOKEN] (state, payload) {
    state.authToken = payload
  },
  [types.SET_ROLE] (state, payload) {
    state.role = payload
  }
}
export {
  state,
  mutations
}
