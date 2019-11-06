<template>
  <div class="input">
    <el-form-item label="年龄">
      <el-input v-model="formInline.user"></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'Input',
  methods: {},
  props: {
    param: Array
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
</style>