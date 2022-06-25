<template>
  <div class="employees-detail-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账号设置">
            <!-- 放置表单 -->
            <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item prop="username" label="姓名:">
                <el-input v-model="userInfo.username" placeholder="请输入姓名" style="width:300px" />
              </el-form-item>
              <el-form-item prop="newPassword" label="密码:">
                <el-input v-model="userInfo.newPassword" placeholder="请输入新密码" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateUserInfo">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-tooltip class="tooltip-box" content="打印基本个人信息">
              <router-link :to="`/employees/print/${id}?type=personal`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
            <!-- 内容 -->
            <UserInfoDetail />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-tooltip class="tooltip-box" content="打印基本岗位信息">
              <router-link :to="`/employees/print/${id}?type=job`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
            <!-- 内容 -->
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import UserInfoDetail from './components/UserInfoDetail.vue'
import JobInfo from './components/JobInfo.vue'

import { reqGetUserDetailById, reqSaveUserDetailById } from '@/api/user'
export default {
  name: 'Detail',
  components: {
    UserInfoDetail,
    JobInfo
  },
  data() {
  return {
    userInfo: {
      username: '',
      newPassword: ''
    },
    rules: {
      username: [
        { required: true, message: '姓名不能为空', trigger: ['blur', 'change'] }
      ],
      newPassword: [
        { min: 6, max: 9, message: '密码必须是6-9位', trigger: ['blur', 'change'] }
      ]
    }
  }
},
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  created() {
   this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
    const { data: { data }} = await reqGetUserDetailById(this.id)
    console.log('用户信息', data)
    this.userInfo = data
    },
    updateUserInfo() {
      // 1. 预校验
      this.$refs.userForm.validate(async boo => {
        if (boo) {
          // 2. 校验通过，发送请求保存员工信息
          await reqSaveUserDetailById(
            // 合并对象的属性  把newPassword赋值给password并合并到userInfo
            {
              ...this.userInfo,
              password: this.userInfo.newPassword
            }
            )
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.employees-detail-container {
  .el-tab-pane {
    padding-top: 10px;
  }
  .tooltip-box {
    position: absolute;
    right: 30px;
    top: 10px;
    z-index: 999;
  }
}
</style>
