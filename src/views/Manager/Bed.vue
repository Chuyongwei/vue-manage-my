<template>
  <div class="app-container">
    <!-- 筛选栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="无效的窗口"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.departmentid"
        placeholder="科室"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option
          v-for="item in departments"
          :key="item.departmentid"
          :label="item.departmentname"
          :value="item.departmentid"
        />
      </el-select>
      <el-select
        v-model="listQuery.type"
        placeholder="类型"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option
          v-for="item in bedtype"
          :key="item.key"
          :label="item.value"
          :value="item.value"
        />
      </el-select>
      <el-radio-group v-model="listQuery.showPatient" @change="handleShow">
        <el-radio-button label="显示全部" />
        <el-radio-button label="显示有病人的床位" />
        <el-radio-button label="显示没有病人的床位" />
      </el-radio-group>
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
        添加床位
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
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
        label="编号"
        prop="bid"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.bid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="病人名字" width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.uname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属科室" width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.departmentname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" min-width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.type | statusFilter">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
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

    <!-- TAG 添加弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
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
        <el-form-item label="类型" prop="type">
          <el-select
            v-model="temp.type"
            class="filter-item"
            placeholder="选择病床的类型"
          >
            <el-option
              v-for="item in bedtype"
              :key="item.key"
              :label="item.value"
              :value="item.value"
              class="filter-item"
              placeholder="Please select"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属科室"
          class="filter-item"
          placeholder="这个床是哪个科室"
          prop="departmentid"
        >
          <el-select v-model="temp.departmentid">
            <el-option
              v-for="item in departments"
              :key="item.departmentid"
              :label="item.departmentname"
              :value="item.departmentid"
              class="filter-item"
              placeholder="Please select"
            />
          </el-select>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 返回 </el-button>
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

const bedtype = [
  { key: 0, value: '静养' },
  { key: 1, value: '公共' },
  { key: 2, value: '重症' }
]
export default {
  name: 'DepartmentTable',
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
    /*     typeFilter(type) {
      return calendarTypeKeyValue[type]
    } */
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        departmentid: '',
        bid: undefined,
        address: '',
        type: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      bedtype,
      departments: [{}],
      //   业务 表现名
      textMap: {
        update: '更新',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        departmentid: [
          { required: true, message: '请选择科室', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '输入病床类型', trigger: 'change' }
        ]
        // introduce: [
        //   {
        //     validator: validateIntroduce,
        //     trigger: "blur",
        //   },
        // ],
      },
      downloadLoading: false
    }
  },
  mounted() {
    this.$axios.post('/admin/checkdepartmentby', this.listQuery).then((e) => {
      console.log(e)
      this.departments = e.data.items
    })
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // TAG 获取数据
      console.log('bed的请求参数', this.listQuery)
      this.$axios
        .post('/admin/checkBedbypage', this.listQuery)
        .then((response) => {
          console.log('bed接收到的,', response.data)
          this.list = response.data.items
          this.total = response.data.total

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
        id: undefined,
        departmentid: '',
        address: '',
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
    // TAG 添加数据
    createData() {
      console.log('创建')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('添加的科室请求信息', this.temp)
          this.$axios.post('admin/addBed', this.temp).then((e) => {
            const newbed = e.data
            newbed.departmentname = this.departments.filter((v) => v.departmentid === newbed.departmentid)[0].departmentname
            this.list.unshift(newbed)
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
      console.log('更新部门')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          this.$axios.post('/admin/updateBed', tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
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
    handleShow(e) {
      // console.log(e);
      this.getList()
    },
    handleDelete(row, index) {
      console.log('删除', row)
      this.$axios.post('admin/deleteBed', row).then((e) => {})
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
        const tHeader = ['病床编号', '病人姓名', '地址', '类型']
        const filterVal = ['bid', 'uname', 'address', 'type']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      const pushlist = {}
      Object.assign(pushlist, this.listQuery)
      pushlist.limit = null
      // TODO 导出数据要修改
      // this.$axios.post("/admin/checkBedbypage", this.listQuery);
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
