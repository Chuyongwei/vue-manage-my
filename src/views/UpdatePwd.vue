<template>
  <div>
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="loginForm"
      label-position="left"
      label-width="80px"
      style="width: 400px; margin-left: 50px"
    >
      <el-form-item prop="olderpass" label="原密码">
        <el-input
          v-model="loginForm.olderpass"
          placeholder="输入原始密码"
          name="password"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password" label="新密码">
        <el-input
          v-model="loginForm.password"
          placeholder="输入新密码"
          name="password"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="repass" label="确认密码">
        <el-input
          v-model="loginForm.repass"
          placeholder="再次输入密码"
          name="repass"
          auto-complete="on"
        />
      </el-form-item>
      <el-button type="primary" @click="updatepwd">修改密码</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      // console.log(value)
      if (!value || value.length < 6) {
        callback(new Error('密码应该超过6位'))
      } else if (value === this.loginForm.olderpass) {
        callback(new Error('修改密码不能与原密码相同'))
      } else {
        callback()
      }
    }

    const validateRepass = (rule, value, callback) => {
      if (this.loginForm.password !== this.loginForm.repass) {
        callback(new Error('密码不一样'))
      } else {
        callback()
      }
    }

    return {
      loginForm: {
        olderpass: '',
        repass: '',
        password: ''
      },
      passwordType: 'password',
      rules: {
        olderpass: [
          { required: true, trigger: 'blur', message: '请输入原密码' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        repass: [
          { required: true, trigger: 'blur', validator: validateRepass }
        ]
      }
    }
  },
  mounted() {
    const id = this.$store.state.user.user.doctorid
    this.loginForm.doctorid = id
    console.log(id)
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    updatepwd() {
      this.$axios.post('/doctor/updatePassword', this.loginForm).then(e => {
        if (e.data === -1) {
          alert('密码错误')
        } else if (e.data === 1) {
          alert('修改成功')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
