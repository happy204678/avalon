<template>
  <div id="app">
    <router-view />
    <hint-component v-show="!showMain" />

  </div>
</template>

<script>
import hintComponent from '@/components/hint'

export default {
  name: 'App',
  components: {
    hintComponent
  },
  data () {
    return {
      showMain: true
    }
  },
  computed: {
  },
  watch: {
  },
  mounted () {
    let vm = this
    if (document.body.clientWidth >= 568) {
      this.showMain = true
    } else {
      this.showMain = false
    }

    window.onresize = function () {
      if (document.body.clientWidth >= 568) {
        vm.showMain = true
      } else {
        vm.showMain = false
      }
      console.log(document.body.clientWidth, vm.showMain)
    }
  }
}
</script>

<style>
@import "./assets/css/layout.css";
@import "./assets/css/common.css";
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #222;
}
</style>
