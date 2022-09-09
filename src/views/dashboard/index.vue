<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>

    <page-tools :show-before="true">

      <span slot="before">2</span>

      <el-button slot="after" type="primary">导入excel}</el-button>

    </page-tools>>

    <ImageUpload />
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
// import PageTools from '@/components/PageTools'
// import UploadExcel from '@/components/UploadExcel'

export default {
  name: 'Dashboard',
  components: {
    // UploadExcel
  //   PageTools
  },
  computed: {
    ...mapGetters([
      'name'
      // 'staffPhoto'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
