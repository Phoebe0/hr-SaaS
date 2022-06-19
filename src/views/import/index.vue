<template>
  <div class="app-container">
    <h3 style="text-align: center">{{ text }}</h3>
    <el-alert
      :title="title"
      type="warning"
      show-icon
    />
    <UploadExcel :on-success="handleSuccess" :before-upload="beforeUpload" />
  </div>
</template>

<script>
import { reqImportEmployees } from '@/api/employees'
import moment from 'moment'
import employeesMenu from '@/api/constant/employees'

export default {
  name: 'Import',
  data() {
    return {}
  },
  computed: {
    // 路由信息对象的标识符
    name() {
      return this.$route.query.name
    },
    text() {
      return this.name === 'employees' ? '员工导入' : '考勤导入'
    },
    title() {
      return this.name === 'employees' ? '每次导入仅可添加1000名员工，姓名、手机、入职时间、聘用形式为必填项 ' : '如果某员工已有打卡记录，最新上传的不覆盖原有数据。可上传多名员工的打卡记录。每名员工可上传多条记录，同考勤日内取员工第一次和最后一次打卡时间。 '
    }
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
    // 上传成功后的处理函数
    async handleSuccess({ results, header }) {
      if (this.name === 'employees') {
      // 中英文对照关系
      const mapRules = {
        '入职日期': 'timeOfEntry',
        '姓名': 'username',
        '工号': 'workNumber',
        '手机号': 'mobile',
        '转正日期': 'correctionTime',
        '部门': 'department',
        '聘用形式': 'formOfEmployment'
      }
      // results表格数据内容 header表格标题
      // 1. 发送请求之前, 将result中文的键,处理成英文的键
      const res = results.map(item => {
        // 定义一个空对象,用来存放转换为英文的员工数据
        const obj = {}
        for (const k in item) {
          const englishKey = mapRules[k] // 英文的键
          obj[englishKey] = item[k]
          if (englishKey === 'timeOfEntry' || englishKey === 'correctionTime') {
            obj[englishKey] = moment(this.formatExcelDate(item[k], '-')).add(1, 'days').format('YYYY-MM-DD')
          } else if (englishKey === 'formOfEmployment') {
            const o = employeesMenu.hireType.find(v => v.value === item[k])
            o ? obj[englishKey] = o.id : obj[englishKey] = 2
          } else {
            obj[englishKey] = item[k]
          }
        }
        return obj
      })
      // 2. 发送批量导入的请求
      await reqImportEmployees(res)
      // 3. 导入成功后返回到员工列表页面
      this.$router.back()
      // console.log(res)
      }
      if (this.name === 'attendances') {
        console.log('考勤导入')
        this.$router.go(-1)
      }
    },

    formatExcelDate(numb, format) {
        const time = new Date((numb - 1) * 24 * 3600000 + 1) // 毫秒
        time.setYear(time.getFullYear() - 70)
        const year = time.getFullYear() + ''
        const month = time.getMonth() + 1 + ''
        const date = time.getDate() - 1 + ''
        if (format && format.length === 1) {
          return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
        }
        return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
      }
  }
}
</script>
