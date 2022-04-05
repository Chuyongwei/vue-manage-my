<template>
  <div class="app-container">
    <!-- 筛选栏 -->
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
      <el-button
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
      </el-checkbox>
    </div>

    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <!-- NOTE 在列中设置sortable属性即可实现以该列为基准的排序 设置为custom 就是有后端排序 -->
      <!-- NOTE slot-scope设置行中的项的名字 -->
      <el-table-column
        label="医生编号"
        prop="doctorid"
        sortable="custom"
        align="center"
        width="100"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.doctorid }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="医生名字" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属科室" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.departmentname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位" min-width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column label="介绍" min-width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.introduce }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Actions"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页栏 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="名字" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名字" />
        </el-form-item>
        <el-form-item label="科室" prop="departmentid">
          <el-select
            v-model="temp.departmentid"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in departments"
              :key="item.key"
              :label="item.departmentname"
              :value="item.departmentid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="temp.position" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="介绍" prop="introduce">
          <el-input
            v-model="temp.introduce"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>

    <!-- emm。。。。这个应该不需要，面板的设置 -->
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogPvVisible = false"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// TAG api
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'DoctorTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    var checkDeparmentId = function(rules, value, callback) {
      if (value === 0) {
        return callback(new Error('选择科室'))
      }
      callback()
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        departmentid: 0,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        departmentname: {},
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      // 部门集合
      departments: [{ departmentid: 0, departmentname: '全部科室' }],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        departmentid: [
          { required: true, message: '请选择科室', trigger: 'change' },
          { validator: checkDeparmentId, trigger: 'change' }
        ],
        name: [{ required: true, message: '名称必须有', trigger: 'blur' }],
        position: [{ required: true, message: '职位必须有', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // TAG 获取数据
      this.departments.push(...this.$store.state.department.departments)
      this.$axios.post('/doctor/check', this.listQuery).then((response) => {
        this.list = response.data.items
        this.total = response.data.total
        console.log('doctor接收的数据', this.list)
        const departments = this.departments
        this.list.map((l) => {
          const department = departments.filter(
            (e) => e.departmentid === l.departmentid
          )
          if (department.length === 0) {
            l.departmentname = ''
          } else {
            l.departmentname = department[0].departmentname
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
          // console.log(l.departmentname[0]["departmentname"]);
          // departments.filters(e=>e.departm/entid==1)
        })
        // Just to simulate the time of the request
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        doctorid: 0,
        introduce: '',
        name: '',
        departmentname: '',
        id: undefined,
        position: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('添加医生的请求', this.temp)
          this.$axios.post('doctor/addDoctor', this.temp).then((e) => {
            const { data } = e
            // this.temp.doctorid = data.doctorid
            data.departmentname = this.departments.filter(e => {
              return e.departmentid === data.departmentid
            })[0].departmentname
            this.list.unshift(data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          this.$axios.post('/doctor/updateDoctor', tempData).then(() => {
            const index = this.list.findIndex(
              (v) => v.doctorid === this.temp.doctorid
            )
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$axios.post('/doctor/deleteDoctor', row)
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['医生编号', '医生名字', '所属科室', '职位', '介绍']
        const filterVal = [
          'doctorid',
          'name',
          'departmentname',
          'position',
          'introduce'
        ]
        const data = this.formatJson(filterVal)
        // console.log("dian");
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    // TAG 添加excel的导入规则
    formatJson(filterVal) {
      // TODO 修改导出excel规则，应该使用全部信息的接口的数据
      const pushlist = {}
      Object.assign(pushlist, this.listQuery)
      pushlist.limit = null
      console.log('准备导出的筛选数据', this.listQuery)
      // this.$axios.post("",)
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
