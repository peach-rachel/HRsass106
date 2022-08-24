<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 用了一个行列布局 -->

        <!-- 放置组织架构 el-tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <tree-tools slot-scope="{data}" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增部门组件 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils'
import AddDept from './components/add-dept'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {},
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showDialog: false,
      node: null // 新增部门的点击节点

    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 获取最新组织架构（刷新）
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = transListToTreeData(result.depts, '')
    },
    addDepts(node) {
      this.node = node
      this.showDialog = true
    },
    editDepts(node) {
      console.log('123')
      this.node = node
      this.showDialog = true
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
/* .tree-card {
  padding: 30px  140px;
  font-size:14px;
} */
</style>
