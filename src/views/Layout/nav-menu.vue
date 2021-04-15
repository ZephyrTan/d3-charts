<template>
  <div class="menu">
    <div class="menu-item">
      力导向图
    </div>
  </div>
</template>

<script>
export default {
  name: "NavMenu"
};
</script>

<style scoped lang="scss">
.menu {
  height: 100%;
  width: 100%;

  .menu-item {
    width: 100%;
    height: 50px;
    background: #246c70;
    cursor: pointer;
    text-align: center;
    line-height: 50px;
    color: #fff;
    font-size: 16px;
  }
}
</style>
