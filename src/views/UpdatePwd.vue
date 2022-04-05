<template>
  <div>
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="80px"
      style="width: 400px; margin-left: 50px"
    >
      <el-form-item prop="password" label="密码">
        <el-input
          v-model="loginForm.password"
          placeholder="Password"
          name="password"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="repass" label="密码">
        <el-input
          v-model="loginForm.repass"
          placeholder="Password"
          name="password"
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
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        repass: '',
        password: ''
      },
      temp: {},
      passwordType: 'password',
      rules: {
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      }
    }
  },
  mounted() {
    const id = this.$store.state.user.user.doctorid
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
      if (this.loginForm.repass === this.loginForm.loginForm.repass) {
        console.log('密码不一致')
      } else {
        console.log('修改密码')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
