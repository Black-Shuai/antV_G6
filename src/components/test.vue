<template>
      <div>
          <ul id="tcontextMenu" style="display: block;">
            <el-button type="text" v-on:click="getmes">编辑</el-button>
            <el-button type="text" v-on:click="getmes">删除</el-button>
        </ul>
      </div>
</template>

<script>
export default {
  name: 'test',
  data () {
    return {
    }
  },
  created () { // 不能在created方法中初始化
    // this.initG6()
  },
  mounted () {
    this.getmes()
  },
  methods: {
    getmes () {
      console.log('初始化成功')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
