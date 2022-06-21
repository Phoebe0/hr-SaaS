<template>
  <div>
    <el-card>
      <UploadImage :limit="3" />
    </el-card>
    <el-card>
      <UploadImage :limit="5" />
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'Dashboard'
}
</script>

<style>

</style>
