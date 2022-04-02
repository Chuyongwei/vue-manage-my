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
      <el-form-item label="病床编号" prop="bid">
        <el-input v-model="temp.bid" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="temp.address"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="输入病床的位置"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      temp: {},
      rules: {}
    }
  },
  mounted() {
    const id = this.$store.state.user.user.doctorid
    console.log(id)
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>
