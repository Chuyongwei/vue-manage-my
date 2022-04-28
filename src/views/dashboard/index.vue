<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎{{ name }}<br>新的一天要努力！！！</div>
    <div class="todoList">
      <!-- 预约人数 {{}} -->
      住院人数 {{ inhospitaltotal }} 预约人数 {{ subscribeTotal }}
    </div>
    <div id="score-static">
      <div :id="subscribe" style="height:300px;width:600px;" />
      <div />
      <div :id="department.id" style="height:400px; width:500px;" />
      <div />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'

export default {
  name: 'Dashboard',
  data() {
    return {
      inhospitaltotal: 0,
      subscribeTotal: 0,
      subscribeData: [],
      subscribeChart: null,
      subscribe: 'subscribe',
      department: { id: 'department' }
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  mounted() {
    const requiredata = { ...this.$store.state.user }
    requiredata.doctorid = requiredata.token
    const user = {}
    Object.assign(user, requiredata)
    console.log('影院', user)
    this.$axios.post('/doctor/inHospital', user).then((e) => {
      console.log(e.data.total)
      this.inhospitaltotal = e.data.total
    })
    this.$axios.post('/doctor/checksubscribe', user).then((e) => {
      console.log('预约', e.data.length)
      this.subscribeTotal = e.data.length
    })
    this.$axios.post('/doctor/DataStatistics', user).then((e) => {
      console.log('获得数据', e.data)
      this.subscribeData = e.data.medicalRecord
      this.department.data = e.data.deparment
    }).then(() => {
      this.initMedicalChart()
      this.initDepartmet()
    })
  },
  methods: {
    initMedicalChart() {
      var div = document.getElementById(this.subscribe)
      console.log('数据', this.subscribeData)
      this.subscribeChart = echarts.init(div)
      this.subscribeChart.setOption({
        title: {
          text: '预约人数图',
          left: 'center'
        },
        // legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['date', '预约数'],
          source: this.subscribeData
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [
          { type: 'bar' }
        ]
      })
    },
    initDepartmet() {
      var div = document.getElementById(this.department.id)
      // console.log('数据', this.subscribeData)
      this.department.chart = echarts.init(div)

      const option = {
        title: {
          text: '科室医生分布图',
          left: 'center'
        },
        legend: {
          top: 'bottom'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}人数 : {c} ({d}%)'
        },
        series: [
          {
            name: '科室分布图',
            type: 'pie',
            // radius: [50, 250],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: this.department.data
          }
        ]
      }
      this.department.chart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
#score-static{
  display: flex;
}
</style>
