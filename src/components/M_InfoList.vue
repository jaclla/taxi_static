<template>
  <div>

    <div align="center" style="margin: 30px;">
      <el-radio-group @change="getList" size="medium" v-model="infoType">
        <el-radio-button label="1">我要开车</el-radio-button>
        <el-radio-button label="0">我要上车</el-radio-button>
      </el-radio-group>
    </div>
    <div align="right" style="margin: 30px;">
      <el-dropdown>
        <el-button type="primary">
          {{serviceInput}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="selectServiceType(item.itemValue,item.itemName)"
                            command="item.itemValue"
                            v-for="(item,index) in serviceType">{{item.itemName}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown>
        <el-button type="primary">
          {{regionInput}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="selectRegion(item.itemValue,item.itemName)"
                            command="item.itemValue"
                            v-for="(item,index) in regionList">{{item.itemName}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button @click="reloadTable()" circle icon="el-icon-refresh-right"
                 style="margin-left: 30px"
                 type="primary"></el-button>
    </div>
    <div v-for="item in tableData" :key="item.itemValue">
      <div @click="selectDetails(item)" >
        <el-card class="box-card" style="line-height: 10px">
          <div slot="header" align="center" >
            <b >{{item.serviceType}} {{item.region}}</b>
          </div>
          <div align="center">
            <span>至少订阅 {{item.subscriptionDate}} 个月</span><br><br><br><br>
            <span>{{item.description}}</span> <br><br><br><br>
            <span> {{item.price}} RMB/月</span> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
            <span>{{item.outTime}}</span>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog
        :title=title+region
        :visible.sync="centerDialogVisible"
        width="50%"
        :center="true"
    >
      <h3 align="center">以每月 {{price}} 的价格，至少订阅 {{subscriptionDate}} 个月</h3>
      <h4 align="center">{{description}}</h4>
      <span class="dialog-footer" slot="footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button @click="centerDialogVisible = false" type="primary">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      // eslint-disable-next-line no-unused-vars
      var serviceInput = "所有服务"
      var regionInput = "所有区域"
      var tableData = [];
      var serviceType = [];
      var regionList = [];
      var serviceTypeInfo;
      var regionInfo;
      var title='';
      var price;
      var subscriptionDate;
      var description;
      var region;
      return {
        infoType: '1',
        tableData,
        serviceType,
        regionList,
        serviceTypeInfo,
        regionInfo,
        serviceInput,
        regionInput,
        centerDialogVisible: false,
        title,
        price,
        subscriptionDate,
        description,
        region
      }
    },
    return: {},
    methods: {
      getList(type, serviceType, region) {
        var data = this.$qs.stringify({
          "type": type,
          "serviceType": serviceType,
          "region": region
        });
        this.axios
        .post('/api/taxiInfo/selectList', data)
        .then(response => (this.tableData = response.data.data))
      },
      selectDetails(row) {
        this.centerDialogVisible = true
        this.title = row.serviceType
        this.price = row.price
        this.subscriptionDate = row.subscriptionDate
        this.description = row.description
        this.region = row.region
      },
      selectServiceType(serviceType, itemName) {
        this.serviceInput = itemName
        this.serviceTypeInfo = serviceType
        this.getList(this.infoType, this.serviceTypeInfo, this.regionInfo)
      },
      selectRegion(region, itemName) {
        this.regionInput = itemName
        this.regionInfo = region
        this.getList(this.infoType, this.serviceTypeInfo, this.regionInfo)
      },
      reloadTable() {
        this.getList(this.infoType)
        this.serviceInput = "所有服务"
        this.regionInput = "所有区域"
        this.serviceTypeInfo = ''
        this.regionInfo = ''
      }
    },
    created() {
      this.getList('1')
      this.axios
      .get('/api/common/dictionary')
      .then(response => {
        (this.serviceType = response.data.data.serviceType);
        (this.regionList = response.data.data.region)
      })
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      "$route": "getList(1)"
    }
  }
</script>

<style>

  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);

  }

  .el-dialog__body {
     overflow: auto;
     color: #666666;
  }


</style>
