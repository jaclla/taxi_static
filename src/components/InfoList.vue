<template>
  <div>
    <el-row>
      <el-button v-on:click="getList('1')">司机</el-button>
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
    <el-pagination
        background
        layout="prev, pager, next"
        :total="1000">
    </el-pagination>
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
      getList(type) {
        var data = this.$qs.stringify({
          "type": type,
          "page":1,
          "size":2
        });
        this.axios
        .post('/api/taxiInfo/selectPage', data)
        .then(response => (this.tableData = response.data.data))
      }
    }
  }
</script>
