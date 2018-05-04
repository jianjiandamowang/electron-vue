<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body,html{
 margin: 0;
 height: 100%;
}
#app{
  height: 100%;
}
.content{
  padding: 30px 0;
}
</style>
