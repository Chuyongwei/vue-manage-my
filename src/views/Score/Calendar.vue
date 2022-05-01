<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="医生姓名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.departmentid"
        placeholder="科室名称"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option
          v-for="item in departments"
          :key="item.departmentid"
          :label="item.departmentname"
          :value="item.departmentid"
        />
      </el-select>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加医生
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出图表
      </el-button>
      <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        style="margin-left: 15px"
        @change="tableKey = tableKey + 1"
      >
        reviewer
      </el-checkbox> -->
    </div>
    <div id="rota" style="width: 100%">
      <!-- 第一行 -->
      <div class="colum" style="font-family: '黑体'">
        <div style="flex: 1" />
        <div
          v-for="{ value, index } of titles"
          :key="index"
          style="background: #458d71"
          class="context"
        >
          {{ value }}
        </div>
      </div>
      <!-- 第n行 -->

      <!-- <div
        v-for="(item,dinex) in dailys"
        :key="dinex"
        class="colum"
        style="height: 90px"
      >
        <div class="firstcloumn" style="">
          <font color="red" text-size="20em"> {{ item }}</font>
        </div>
        <div v-for="( context, index ) in titles" :key="index" class="context">
          {{ dutyList[5].wid }}
        </div>
      </div> -->
      <div
        v-for="(item, row) in dutyList"
        :key="row"
        class="colum"
        style="height: 90px"
      >
        <div class="firstcloumn" style="">
          <font color="red" text-size="20em"> {{ dailys[row] }}</font>
        </div>
        <div
          v-for="(context, col) in item"
          :key="col"
          class="context"
          @click="updateDuty(context,row,col)"
        >
          {{ context.doctor_id == null ? '无' : context.name }}
        </div>
      </div>
    </div>

    <el-dialog title="更新" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-select
          v-model="temp.doctorid"
          class="filter-item"
          placeholder="修改值"
        >
          <el-option
            v-for="item in doctors"
            :key="item.doctorid"
            :label="item.name"
            :value="item.doctorid"
          />
        </el-select>
        {{ temp.doctorid==null?"null":temp.doctorid }}
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 返回 </el-button>
        <el-button type="primary" @click="updateData()"> 提交 </el-button>
      </div>
    </el-dialog>

    <!-- <el-table
      style="width: 90%"
      border
      fit
    >
      <el-table-column label="" min-width="150px" align="center" />
      <el-table-column label="星期一" width="150px" align="center" />
      <el-table-column label="星期二" width="150px" align="center" />
      <el-table-column label="星期三" width="150px" align="center" />
      <el-table-column label="星期四" width="150px" align="center" />
      <el-table-column label="星期五" width="150px" align="center" />
      <el-table-column label="星期六" width="150px" align="center" />
      <el-table-column label="星期六" width="150px" align="center" />
    </el-table> -->
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
export default {
  name: 'Calendar',
  directives: { waves },
  data() {
    return {
      listQuery: {},
      departments: [],
      titles: [
        { value: '星期一' },
        { value: '星期二' },
        { value: '星期三' },
        { value: '星期四' },
        { value: '星期五' },
        { value: '星期六' },
        { value: '星期七' }
      ],
      departmentid: 1,
      rules: {},
      dialogFormVisible: false,
      doctors: [],
      dutyList: [],
      tableData: [],
      dailys: ['上午', '下午', '晚上'],
      temp: {
      }
    }
  },
  created() {
    setTimeout(() => {
      this.departments = this.$store.state.department.departments
    }, 1000)
    this.getList()
  },
  methods: {
    getList() {
      this.$axios.get('/admin/checkDutyByDepartment?departmentid=' + this.departmentid).then((e) => {
        const dutyList2 = e.data
        this.dutyList = []
        console.log('获取的数据', dutyList2)
        for (let i = 0; i < dutyList2.length; i++) {
          const week = parseInt((i + 21) % 21 / 3)
          const am = i % 3
          console.log(week, am)
          if (week === 0) { this.dutyList[am] = [] }
          this.dutyList[am][week] = dutyList2[i]
        }
        console.log('获取的值班表', this.dutyList)
      })
      const doctor = {
        departmentid: this.departmentid
      }
      this.$axios.post('/doctor/check', doctor).then((e) => {
        console.log('获取的医生', e)
        this.doctors = e.data.items
      })
    },
    handleFilter() {
      this.departmentid = this.listQuery.departmentid
      this.getList()
    },
    updateDuty(node, row, col) {
      const user = this.$store.state.user
      let b = true
      user.roles.forEach(e => {
        if (e === 'admin') {
          b = false
        }
      })
      if (b === true) return
      this.temp = {}
      Object.assign(this.temp, node)
      // this.temp.doctorid = node.doctor_id
      console.log('弹窗数据', this.temp)
      this.dialogFormVisible = true
      this.listQuery.row = row
      this.listQuery.col = col
    },
    updateData() {
      this.temp.dutyid = this.temp.duty_id
      // Object.assign(this.temp, { ...doctor[0] })
      // this.temp.doctor = null
      this.temp.departmentid = this.departmentid
      const row = this.listQuery.row
      const col = this.listQuery.col
      console.log('提交数据', this.temp)
      this.$axios.post('admin/updateDuty', this.temp).then(e => {
        if (e.data > 0) {
          const doctor = {
            doctor_id: this.temp.doctorid,
            name: this.temp.name
          }
          Object.assign(this.dutyList[row][col], doctor)
          this.dutyList[row][col]
          console.log(this.dutyList[row][col])
        }
      }).then(() => {
        this.dialogFormVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#rota {
  margin: 30px;
  font-weight: 500;
  font-size: 1.3em;
  font-family: "楷体";
  text-align: center;
  border: 1px #dfe6ec solid;
}
.firstcloumn {
  padding-top: 1em;
  border-radius: 3px;
  border: 1px #dfe6ec solid;
  flex: 1;
  text-align: center;
}
.colum {
  display: flex;
  width: 90%;
  background: #ffffff;
  height: 80px;
}
.context {
  padding-top: 1em;
  border-radius: 3px;
  border: 1px #dfe6ec solid;
  width: 12%;
  height: 100%;
  background: #ffffff;
}
</style>
