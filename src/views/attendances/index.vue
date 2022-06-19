<template>
  <div class="attendances-container">
    <div class="app-container">
      <h4>
        出勤
      </h4>
      <el-button @click="$router.push('/import?name=attendances')">
        导入出勤
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Attendances'
}
</script>

<style>

</style>
