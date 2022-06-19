<template>
  <div class="app-container">
    <UploadExcel :on-success="handleSuccess" :before-upload="beforeUpload" />
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {}
  },
  methods: {

    beforeUpload(file) {
      // 上传excel文件的预校验函数，判断上传的文件是否小于1M
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      // results表格数据内容 header表格标题
      console.log(results, header)
      this.tableData = results
      this.tableHeader = header
    }
  }
}
</script>
