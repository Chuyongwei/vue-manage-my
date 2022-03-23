<template>
  <div class="app-container">
    <!-- 筛选栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.uname"
        placeholder="名字"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.type"
        placeholder="住院类型"
        clearable
        style="width: 120px"
        class="filter-item"
        @change="getList"
      >
        <el-option
          v-for="item in bedtype"
          :key="item.index"
          :label="item.value"
          :value="item.index"
        />
      </el-select>
      <!-- <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select> -->
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
        添加
      </el-button> -->
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
        label="病历号"
        prop="medical_id"
        sortable="custom"
        align="center"
        width="100"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.doctorid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="患者名字" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.uname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="症状" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.symptoms }}</span>
        </template>
      </el-table-column>
      <el-table-column label="病床编号" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.bid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处方" min-width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.prescription }}</span>
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
            Edit
          </el-button>
          <el-button
            v-if="row.status != 'published'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row, 'published')"
          >
            Publish
          </el-button>
          <el-button
            v-if="row.status != 'draft'"
            size="mini"
            @click="handleModifyStatus(row, 'draft')"
          >
            Draft
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            Delete
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
        label-width="90px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="名字" prop="name" style="width: 260px">
          <el-input v-model="temp.uname" placeholder="请输入名字" disabled />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select
            v-model="temp.state"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in states"
              :key="item.index"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="症状" prop="symptoms">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="temp.symptoms"
          ></el-input>
        </el-form-item>
        <el-form-item label="处方" prop="prescription">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="temp.prescription"
          ></el-input>
        </el-form-item>
        <!-- TAG 是否要跟踪 -->
        <template v-if="isTrack">
          <el-form-item label="下次日期" prop="trackdate">
            <el-date-picker
              v-model="temp.trackdate"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="跟踪地址" prop="trackaddress">
            <el-input v-model="temp.trackaddress" placeholder="请输入地址" />
          </el-form-item>
        </template>
        <!-- TAG 是否转院 -->
        <template v-if="isTransfer">
          <el-form-item label="住院状态" prop="state">
            <el-select
              v-model="temp.type"
              class="filter-item"
              placeholder="Please select"
            >
              <el-option
                v-for="item in bedtype"
                :key="item.index"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
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
        <el-button type="primary" @click="dialogPvVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// TAG api
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "InhopitalTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  watch: {
    "temp.state"() {
      this.isTransfer = false
      this.isTrack = false
      if (this.temp.state == "转院") {
        this.isTransfer = true
        console.log("病人出院了");
      }
      if (this.temp.state == "出院") {
        this.isTrack = true;
        console.log("跟踪病人");
      }
    },
  },
  data() {
    let bedtype = [
      {
        index: 0,
        value: "公共",
      },
      {
        index: 1,
        value: "静养",
      },
      {
        index: 2,
        value: "重症",
      },
    ];
    // TAG 日期管理
    let pickerOptions = {
      disabledDate(time) {
        return time.getTime() < Date.now();
      },
      shortcuts: [
        {
          text: "今天",
          onClick(picker) {
            picker.$emit("pick", new Date());
          },
        },
        {
          text: "明天",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit("pick", date);
          },
        },
        {
          text: "一周后",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit("pick", date);
          },
        },
      ],
    };
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        departmentname: {},
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
      },
      states: [
        {
          index: 3,
          value: "出院",
        },
        {
          index: 4,
          value: "转院",
        },
        {
          index: 5,
          value: "跟踪",
        },
      ],
      isTrack: false,
      isTransfer: false,
      bedtype,
      pickerOptions,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        state: [],
        symptoms: [
          { required: true, message: "symptoms is required", trigger: "blur" },
        ],
        prescription: [
          {
            required: true,
            message: "prescription is required",
            trigger: "blur",
          },
        ],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      // TAG 获取数据
      let requiredata = { ...this.$store.state.user };
      requiredata.doctorid = requiredata.token;
      Object.assign(this.listQuery,requiredata)
      console.log("获取住院病人", this.listQuery);
      this.$axios.post("/doctor/inHospital", this.listQuery).then((e) => {
        console.log("inHospital", e.data);
        let { data } = e;
        this.list = data.items;
        this.total = data.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success",
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        doctorid: 0,
        introduce: "",
        name: "",
        departmentname: "",
        id: undefined,
        importance: 1,
        position: "",
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.trackdate = this.dateFormat(tempData.trackdate);
          
          this.$axios.post("/doctor/commitsubscribe", tempData).then(() => {
            // const index = this.list.findIndex(
            //   (v) => v.doctorid === this.temp.doctorid
            // );
            // this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000,
            });
            
          });
          
        }
      });
    },
    dateFormat(dateData) {
      var date = new Date(dateData);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      const time = y + "-" + m + "-" + d;
      return time;
    },
    handleDelete(row, index) {
      this.$notify({
        title: "Success",
        message: "Delete Successfully",
        type: "success",
        duration: 2000,
      });
      this.list.splice(index, 1);
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["医生编号", "医生名字", "所属科室", "职位", "介绍"];
        const filterVal = [
          "doctorid",
          "name",
          "departmentname",
          "position",
          "introduce",
        ];
        const data = this.formatJson(filterVal);
        // console.log("dian");
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list",
        });
        this.downloadLoading = false;
      });
    },
    // TAG 添加excel的导入规则
    formatJson(filterVal) {
      // TODO 修改导出excel规则，应该使用全部信息的接口的数据
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>
