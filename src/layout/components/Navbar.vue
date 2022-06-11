<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="app-breadcrumb">
      XXX 有限公司
      <span class="breadBtn">Beta版</span>
    </div>
    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-imgerr="defaultImg" :src="avatar || defaultImg" class="user-avatar">
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color:#fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>

          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Hamburger from '@/components/Hamburger'

import defaultImg from '@/assets/common/bigUserHeader.png'
export default {
  components: {
    Hamburger
  },
      data() {
          return {
            defaultImg
          }
      },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar',
        'name'
      ])
    },
  created() {
    console.log('发送请求获取用户信息')
    // 触发action发送登录请求
    // this.$store.dispatch('user/getUserInfo')
     // 但是登陆成功后，由/login到了首页才加在加载页面结构，所以进入首页才获取个人信息就太晚了
      // 权限系统：不同用户展示的左侧边栏不同  所以在进入首页之前就要获取到个人信息
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出功能
     logout() {
      console.log('退出系统')
       this.$confirm('确认退出系统?', '提示', {

          type: 'warning'
        }).then(() => {
          // 点了成功会执行的代码
        // 2. 点了确定，要清楚个人信息 token
        this.$store.dispatch('user/logout')
        // 3. 跳转至登陆页面
        this.$router.push('/login')
        // 4. 提示退出成功
          this.$message({
            type: 'success',
            message: '退出系统成功'
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '取消退出'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>

.app-breadcrumb {
  display: inline-block;
  font-size: 18px;
  line-height: 50px;
  margin-left: 10px;
  color: #ffffff;
  cursor: text;
  .breadBtn {
    background: #84a9fe;
    font-size: 14px;
    padding: 0 10px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    border-radius: 10px;
    margin-left: 15px;
  }
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
   background-image: -webkit-linear-gradient(left, #3d6df8, #5b8cff);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

.avatar-container {
      margin-right: 30px;

  .avatar-wrapper {
    position: relative;

    .user-avatar {
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 15px;
      vertical-align: middle;
    }
      .name {
        cursor: pointer;
        color: #fff;
        vertical-align: middle;
        margin-left:5px;
      }
      .user-dropdown {
        color: #fff;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 20px;
        font-size: 12px;
      }
    }
    }
  }
}
</style>
