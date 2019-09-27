<template>
  <div>
    <el-row>
      <el-button v-on:click="getList">司机</el-button>
      <el-button>乘客</el-button>
    </el-row>
    <el-table
        :data="tableData"
        stripe
        style="width: 100%">
      <el-table-column
          prop="id"
          label="id"
          width="180">
      </el-table-column>
      <el-table-column
          prop="userName"
          label="姓名"
          width="180">
      </el-table-column>
    </el-table>
  </div>

</template>

<script type="text/ecmascript-6">
  // import {taxiList} from '@/assets/js/ajax'
  export default {
    data() {
      // eslint-disable-next-line no-unused-vars
      var tableData = []
      return {
        tableData
      }
    },
    return: {},
    methods: {
      getList() {
        // this.tableData = taxiList;
        // 发送get请求
        this.axios
        .get('/api/selectList')
        .then(response => (this.tableData = response.data.data))

      }
    }
  }
</script>
