<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <!-- 左侧内容 -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <!-- 内容 -->
            <span>操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delete">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>

      <!-- 右侧内容 -->
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 点击 编辑、删除、新增
    operateDepts(type) {
      if (type === 'add') {
        this.$emit('addDepts', this.treeNode) // 向父集发送自定义事件，触发新增弹层展示
      } else if (type === 'edit') {
        console.log('456')
        this.$emit('editDepts', this.treeNode)
      } else {
        this.$confirm('您确定要删除该项吗？').then(() => {
          return delDepartments(this.treeNode.id).then(() => { // 调用api方法返回的是promise对象，用await/then+catch
            this.$emit('delDepts') // 触发自定义事件
            this.$message.success('删除部门成功')
          })
        })
      }
    }
  }
}
</script>

<style>

</style>
