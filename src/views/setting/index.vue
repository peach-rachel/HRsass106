<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height:60px">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <el-table border="" :data="list">
              <el-table-column type="index" label="序号" width="120" align="center" />
              <el-table-column prop="name" label="角色名称" width="240" align="center" />
              <el-table-column prop="description" label="描述" align="center" />
              <el-table-column label="操作" align="center">
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>

              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="center" style="height: 60px">
              <el-pagination
                layout="prev, pager, next"
                :page-size="page.pagesize"
                :total="page.total"
                :current-page="page.page"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息">
            <el-alert
              show-icon
              :closable="false"
              type="info"
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            />
            <el-form label-width="120px" style="margin-top:20px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" disabled style="width:400px" type="textarea" :row="3" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 编辑角色 弹层组件 -->
    <el-dialog title="编辑角色" :visible="showDialog">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="btnCancle">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 弹层 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        node-key="id"
        :default-checked-keys="selectCheck"
        :default-expand-all="true"
      />
      <!-- 确定/取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnPermCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnPermOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { mapGetters } from 'vuex'
import { transListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permisson'
export default {
  data() {
    return {
      list: [], // 承接数组
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      formData: {}, // 公司信息
      showDialog: false,
      roleForm: {}, // 角色信息
      rules: {
        name: [{ trigger: 'blur', required: true, message: '角色名称不能为空！' }]
      },
      showPermDialog: false, // 权限分配 弹窗
      permData: {}, // 权限数据树
      defaultProps: { label: 'name' },
      roleId: null, // 用来记录分配角色的id
      selectCheck: [] // 当前该角色的权限
    }
  },
  computed: {
    ...mapGetters
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      // newPage是当前点击的页码,是elul自带的事件监听回掉参数
      this.page.page = newPage
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 删除角色
    async deleteRole(id) {
      await this.$confirm('确定要删除该角色吗？')
      try {
        await deleteRole(id)
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑角色信息
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    // 点击确定
    async btnOk() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          // 编辑角色
          await updateRole(this.roleForm)
        } else {
          // 新增角色
          await addRole(this.roleForm)
        }
        //  刷新数据
        await getRoleList()
        this.$message.success('操作成功！')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 点击取消
    btnCancle() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields() // 移除校验
      this.showDialog = false
    },
    // 点击为角色 分配权限
    async assignPerm(id) {
      this.roleId = id
      // 把当前角色信息回写到页面上
      this.permData = transListToTreeData(await getPermissionList(), '0') // 转化后的权限树形数据
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds
      this.showPermDialog = true
    },
    // 确定
    async btnPermOk() {
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId }).then(() => {
        this.$message.success('权限设置成功！')
        this.showPermDialog = false
      })
    },
    // 取消
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    }
  }
}
</script>

<style>

</style>
