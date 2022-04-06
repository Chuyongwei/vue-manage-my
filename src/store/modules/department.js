import { logout, getInfo } from '@/api/user'
import { removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { getDepartment } from '@/api/department'

const getDefaultState = () => {
  return {
    departments: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_DEPARTMENT: (state, departments) => {
    state.departments = departments
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  getDepartment({ commit }) {
    getDepartment().then((data) => {
      commit('SET_DEPARTMENT', data)
    })
  },

  // get user info 这里的token就是医生的doctor——id号
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(data => {
        // const { data } = response
        console.log('store获取的user', data)
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, roles } = data
        commit('SET_USER', data)
        commit('SET_NAME', name)
        commit('SET_ROLES', roles)
        // commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

