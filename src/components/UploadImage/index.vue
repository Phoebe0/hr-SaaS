<template>
  <!--
    1. list-type: 展示的是上传组件的类型 text picture picture-card
    2. action 必填
    3. file-list="[{}]"  文件列表
    4. on-preview 点击文件列表中的图片触发对应的处理函数
    5. limit 允许上传的最大个数
    6. on-remove	文件列表移除文件时的钩子
    7. http-request	覆盖默认的上传行为，可以自定义上传的实现
    8. on-change	文件状态改变时的钩子，添加文件会被调用
  -->
  <div>
    <el-upload
      :class="{myBox: isShow}"
      list-type="picture-card"
      action=""
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :limit="limit"
      :http-request="handleUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 图像预览对话框 -->
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      style="text-align:center"
    >
      <img width="100%" :src="url" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  props: {
    // 允许上传的最大数量
    limit: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      // fileList上传文件的列表 数组包对象，url提供图片地址
      fileList: [
        { url: 'https://avatar-1312548952.cos.ap-shanghai.myqcloud.com/4.jpg' }
        // { url: 'https://avatar-1312548952.cos.ap-shanghai.myqcloud.com/4.jpg' },
        // { url: 'https://avatar-1312548952.cos.ap-shanghai.myqcloud.com/4.jpg' },
        // { url: 'https://img0.baidu.com/it/u=2454417304,3805272118&fm=253&fmt=auto&app=138&f=GIF?w=800&h=500' }

      ],
      dialogVisible: false,
      url: '' // 预览图片的地址
      // limit: 3 // 允许上传的最大数量
    }
  },
  computed: {
    isShow() {
      if (this.fileList.length >= this.limit) {
        this.$message.warning('最多上传三张图片')
        return true
      }
      return false
    }
  },
  methods: {
    // 图片预览
    handlePreview(file) { // file点击的图片对象
      // 1. 取到点击的图片url
      this.url = file.url
      // 2. 准备一个对话框展示图片
      this.dialogVisible = true
    },
    // 图片删除
    handleRemove(file, fileList) {
      // file是删除的图片
      // fileList是剩余的图片列表

      // 将删除后剩余的数组赋值给data中的文件列表filelist
      this.fileList = [...fileList]
      // console.log('删除', file, fileList)
    },
    // 覆盖默认上传行为
    handleUpload(obj) {
      // obj是上传的文件信息对象 obj.file是上传的文件对象
    },
    // 添加文件
    handleChange(file, fileList) {
      this.fileList = [...fileList]
    }
  }
}
</script>

<style lang="scss" scoped>
// 如果元素有myBox这个类，则隐藏
.myBox{
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}

</style>
