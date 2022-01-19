
import * as types from './mutation-types'
import store from 'storejs'

export const setAuthToken = ({ commit }, value) => {
  store.set('authToken', value)
  commit(types.SET_AUTHTOKEN, value)
}
export const setRole = ({ commit }, value) => {
  store.set('role', value)
  commit(types.SET_ROLE, value)
}
export const setAccountName = ({ commit }, value) => {
  store.set('accountName', value)
  commit(types.SET_ACCOUNTNAME, value)
}
