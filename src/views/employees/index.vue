<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入</el-button>
          <el-button size="small" type="danger" @click="exportData">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column label="头像" align="center" style="width:180px">
            <!-- 作用域插槽 -->
            <template slot-scope="{row}">
              <img
                slot="reference"
                v-imageerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto "
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="shwoQrDialog(row.staffPhoto )"
              >
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column prop="formOfEmployment" label="聘用形式" sortable="" :formatter="formatEmployment" />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
            <!-- <template slot-scope="obj">
              {{ obj.timeOfEntry| formatDate }}
            </template> -->
            <template v-slot="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="">
            <template slot-scope="{row}">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="ldeEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          :total="page.total"
          :page-size="page.size"
          :current-page.sync="page.page"
          layout="total, prev,pager, next"
          @current-change="getEmployeeList"
        />
      </el-row>
    </div>
    <!-- 新增员工 弹窗 -->
    <add-employee :show-dialog.sync="showDialog" />
    <!-- 二维码 弹窗 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row>
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-row></el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'

export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      loading: false,
      list: [], // 接受数组
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      showDialog: false,
      showCodeDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.page.total = total
    },
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee(id) {
      try {
        this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除成功！')
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel
    exportData() {
      // 定义表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import ('@/vendor/Export2Excel').then(async excel => {
        // excel是引入文件的导出对象
        //  获取员工信息api，显示在1页上
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // 返回的data就是要导出的excel的结构；
        // formatJson下方进行定义该用于数据转换的方法
        const data = this.formatJson(headers, rows)
        // 复杂表头
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料表',
          multiHeader,
          merges

        })
      })
    },
    // 转换导出数据的格式，将[{}] => [[]]
    formatJson(headers, rows) {
      // rows是所有的数据，格式为数组套对象
      return rows.map(item => {
        // 遍历rows，item是一个对象，{mobile:132111,username:"张三"}
        // 解释：item就是所有数据的每一条，都以对象的形式存在
        return Object.keys(headers).map(key => {
          // Object.keys() 该原生方法拿到对象里的每一个key形成新数组
          // Object.keys(headers)拿到中文表头,map中的key是单个中文表头（1项）
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]]) // 格式化日期格式
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]] // headers[key]中文表头对应的英文表头
          // item[headers[key]] 英文表头对应的值，返回新数组
        })
      })
    },
    // 二维码
    shwoQrDialog(url) {
      if (url) {
        this.showCodeDialog = true
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户尚未上传头像！')
      }
    }
  }
}
</script>

<style>

</style>
