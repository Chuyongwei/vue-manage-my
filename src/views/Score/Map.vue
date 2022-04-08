<template>
  <div id="Map">
    <div v-for="(map, mapid) in maps" :key="mapid" class="floor-plan">
      <div class="floor">
        <div v-for="m in map[0]" :key="m.id" class="floor-item">
          {{ m.address }}--{{ m.name }}
        </div>
      </div>
      <span style="color: red">dsafhjk</span>
      <div class="floor-right">
        <div v-for="m in map[0]" :key="m.id" class="floor-item">
          {{ m.address }}--{{ m.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Map',
  data() {
    return {
      maps: []
    }
  },
  created() {
    this.maps[0] = []
    //   this.maps[1] = []
    this.maps[0][0] = new Array(6)
    this.maps[0][1] = new Array(3)
    let index = 0
    for (let i = 0; i < this.maps[0][0].length; i++) {
      this.maps[0][0][i] = {
        id: index++,
        address: 'A0' + index,
        name: '科室'
      }
    }
    for (let i = 0; i < this.maps[0][1].length; i++) {
      this.maps[0][1][i] = {
        id: index++,
        address: 'A0' + index,
        name: '科室'
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
#Map {
  margin-top: 33px;
  width: 90%;
  margin-left: 51px;
  background: #07374d;
  padding-top: 20px;
}
.floor-plan {
  display: flex;
}
.floor {
  display: flex;
  flex-flow: wrap row-reverse;
  width: 45%;
//   background: red;
  border-top: 3px #fff solid;
  color: #fefdf6;
  border-right: 20px #32b0ed solid;
}
.floor-item {
  width: 120px;
  height: 30px;
}
.floor-right {
  //   float: right;
  margin-left: 10% ;
  position: relative;
  right: 0px;
  display: flex;
  flex-flow: wrap row;
  width: 45%;
//   background: red;
  border-top: 3px #fff solid;
  color: #fefdf6;
  border-left: 20px #32b0ed solid;
}
</style>
