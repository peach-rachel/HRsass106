<template>
  <el-dialog :visible="showRoleDialog" title="分配角色">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox
        v-for="item in checkList"
        :key="item.id"
        :label="item.id"
      >
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>

    <el-row shot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      default: false,
      type: Boolean
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      checkList: [], // 定义角色种类的数组
      roleIds: [] // 用户
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 拿到角色列表
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.checkList = rows
    },
    // 拿到用户的角色信息，是父组件使用
    async  getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    // 修改角色对api
    async btnOk() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false)
    },
    async btnCancel() {
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style>

</style>
