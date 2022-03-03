import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  // TAG 登录的业务
  // user login
  login({ commit }, userInfo) {
    const { doctorid, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ doctorid: doctorid.trim(), password: password }).then(data => {
        console.log("store接收的",userInfo);
        // const { data } = response
        console.log("store中的登录",data);
        commit('SET_TOKEN', data.doctorid)
        setToken(data.doctorid)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info 这里的token就是医生的doctor——id号
  getInfo({ commit, state }) {
    console.log("store",state);
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(data => {
        // const { data } = response
        console.log("data",data);
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name } = data

        commit('SET_NAME', name)
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

