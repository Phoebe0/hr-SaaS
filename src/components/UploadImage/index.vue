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
    9. accept 限制上传的文件类型
    10. before-upload	上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
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
      :before-upload="beforeUpload"
      accept="image/*"
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
import COS from 'cos-js-sdk-v5'
var cos = new COS({
    SecretId: 'AKID7C4wb1DAuPfiX9XhxylJgroV5RYQ9oGT',
    SecretKey: '1nLfkcIkxv0uc6LMBl6E8mBcsvkLkwue'
})
export default {
  name: 'UploadImage',
  props: {
    // 允许上传的最大数量
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // fileList上传文件的列表 数组包对象，url提供图片地址
      fileList: [
        // { url: 'https://avatar-1312548952.cos.ap-shanghai.myqcloud.com/4.jpg' }
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
    },
    // 判断所有的图片是否上传完成 status === success percentage === 100
    isAllFinished() {
      return this.fileList.every(item => item.status === 'success' && item.percentage === 100)
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
    // 上传前对文件类型或大小进行校验
    beforeUpload(file) {
      if (file.size / 1024 / 1024 > 2) {
        this.$message.warning('上传图像大小在1M以内')
        return false
      }
      return true
    },

    // 覆盖默认上传行为
    handleUpload({ file }) {
       const obj = this.fileList.find(item => item.uid === file.uid)
      // obj是上传的文件信息对象 obj.file是上传的文件对象
      cos.putObject({
      Bucket: 'avatar-1312548952', /* 必须 存储桶的名称 */
      Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
      Key: file.name + +new Date(), /* 必须唯一 上传的图像在存储桶的名字，不然就会覆盖 */
      StorageClass: 'STANDARD',
      Body: file, // 上传文件对象
      onProgress: progressData => {
        // 上传图片期间，持续触发的函数
        // progressData上传的对象
        // loaded 已上传大小 total 总大小 speed 上传速度 percent 上传的百分比（0-1）

        // 上传期间加载进度条
        // 1. 先找到要控制进度条的fileList中的一项

        console.log(obj)
        if (obj) {
          // obj.status = 'uploading'
          // 2. 将进度条的进度设置为上传的百分比
          obj.percentage = progressData.percent * 100
          // 3. 上传完毕后，关闭进度条
          progressData.percent === 1 ? obj.status = 'success' : obj.status = 'uploading'
        }
      }
}, (err, data) => {
  // 上传完成后触发 data是成功的对象 data.Location是图片真实的腾讯云地址
  // 上传成功后data.Location的真实路径地址要存储到fileList对应的数组元素中
    if (err) return this.$message.error('上传失败')
    obj.url = 'https://' + data.Location
})
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
