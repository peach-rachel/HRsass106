<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名" prop="username">
                <input v-model="userInfo.username" type="text" style="width:300px">
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <input v-model="userInfo.password2" type="password" style="width:300px">
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 详情组件 -->
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="JobComponent" />
            <!-- <job-info /> -->
          </el-tab-pane>

        </el-tabs>

      </el-card>
    </div>
  </div>
</template>

<script>
import { saveUserDetailById } from '@/api/employees'
import { getUserDetailById } from '@/api/user'
import userInfo from './components/user-info'
import JobInfo from './components/job-info'
export default {
  components: {
    userInfo, JobInfo
  },
  data() {
    return {
      JobComponent: 'job-info',
      userInfo: {
        username: '',
        password2: '' // 请求中的password是加密字符
      },
      rules: {
        username: [{ required: true, trigger: 'blur', message: '姓名不能为空！' }],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.$route.params.id)
    },
    saveUser() {
      this.$refs.userForm.validate().then(async() => {
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('更新成功！')
      })
    }
  }
}
</script>

<style>

</style>
