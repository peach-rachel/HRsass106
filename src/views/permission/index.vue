<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(0,1)">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button v-if="row.type === 1" type="text" @click="addPermission(row.id,2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column></el-table>
      <!-- 新增权限编辑 弹层 -->
      <el-dialog
        :visible="showDialog"
        title="权限管理"
        @close="btnCancel"
      >
        <el-form ref="perForm" :model="formData" label-width="120px" :rules="rules">
          <el-form-item label="权限名称" prop="formData.name">
            <input v-model="formData.name" style="width:90%;height:30px">
          </el-form-item>
          <el-form-item label="权限标识" prop="formData.code">
            <input v-model="formData.code" style="width:90%;height:30px">
          </el-form-item>
          <el-form-item label="权限描述" prop="formData.description">
            <input v-model="formData.description" style="width:90%;height:30px">
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="btnOK">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, updatePermission, addPermission, getPermissionDetail, delPermission } from '@/api/permisson'
import { transListToTreeData } from '@/utils'

export default {
  data() {
    return {
      list: [], // 定义权限列表
      showDialog: false, // 新增编辑权限弹层
      formData: {
        name: '',
        code: '',
        description: '', // 描述
        type: '', // 类型
        pid: '', // 因为是树形结构，需要pid
        enVisible: '0' // swich 开启,active-calue/inactive-calue 是设定开启/关闭的值 的
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '权限名称不能为空' }],
        code: [{ required: true, trigger: 'blur', message: '权限标识不能为空' }]
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 获取权限列表
    async getPermissionList() {
      this.list = transListToTreeData(await getPermissionList(), '0') // 将权限数据转为树形结构
    },
    // 删除
    async delPermission(id) {
      try {
        this.$confirm('确定删除该权限吗？').then(async() => {
          await delPermission(id).then(() => {
            this.getPermissionList()
            this.$message.success('删除成功！')
          })
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 添加权限的api请求
    async addPermission(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    // 编辑 情况，先获取原数据
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    btnOK() {
      this.$refs.perForm.validate().then(() => {
        // 先判断ID。有就是编辑
        if (this.formData.id) {
          return updatePermission(this.formData)
        }
        // 没有id，就是“添加”
        return addPermission(this.formData)
      }).then(() => {
        this.$message.success('新增成功！')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
