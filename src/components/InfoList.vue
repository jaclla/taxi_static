<template>
  <div>

    <div style="margin: 30px;">
      <el-radio-group @change="getList" size="medium" v-model="infoType">
        <el-radio-button label="1">我要开车</el-radio-button>
        <el-radio-button label="0">我要上车</el-radio-button>
      </el-radio-group>
    </div>
    <el-table
        :data="tableData"
        stripe
        style="width: 100%">
      <el-table-column
          align="center"
          label="服务类型"
          prop="serviceType" width="180">
      </el-table-column>
      <el-table-column
          align="center"
          label="价格(RMB/月)"
          prop="price" width="180">
      </el-table-column>
      <el-table-column
          align="center"
          label="至少订阅时间(月)"
          prop="subscriptionDate" width="180">
      </el-table-column>
      <el-table-column
          align="center"
          label="描述"
          prop="description"
          width="%50"
      >
      </el-table-column>
      <el-table-column
          align="center"
          label=""
          prop="outTime" width="180">
      </el-table-column>
    </el-table>
  </div>

</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      // eslint-disable-next-line no-unused-vars
      var tableData = [];
      return {
        infoType: '1',
        tableData
      }
    },
    return: {},
    methods: {
      getList(type) {
        var data = this.$qs.stringify({
          "type": type
        });
        this.axios
        .post('/taxiInfo/selectList', data)
        .then(response => (this.tableData = response.data.data))
      }
    },
    created() {
      this.getList('1')
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      "$route":"getList(1)"
    }
  }
</script>
