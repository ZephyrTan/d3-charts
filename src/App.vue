<template>
  <div class="app-container">
    <div class="left-menu">

    </div>
    <div class="right-container">
      <router-view/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {}
};
</script>
<style lang="scss">
.app-container {
  height: 100%;
  width: 100%;
  display: flex;

  .left-menu {
    width: 200px
  }

  .right-container {
    flex-grow: 1;
  }
}
</style>
