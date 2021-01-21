<template>
   <the-header />
   <router-view></router-view>
</template>

<script>
import TheHeader from "@/components/layout/TheHeader"
   
export default {
   name: "App",
   components: {
      TheHeader
   },
   computed: {
      didLogout() {
         return this.$store.getters.didLogout
      }
   },
   created() {
      this.$store.dispatch('tryLogin')
   },
   watch: {
      didLogout(currentValue, oldValue) {
         if (currentValue && currentValue !== oldValue) {
            this.$router.replace('/coaches')
         }
      }
   }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}

button {
   outline: none;
}

.route-enter-from {
   opacity: 0;
   transform: translateY(-30px);
}

.route-leave-to {
   opacity: 0;
   transform: translateY(30px);
}

.route-enter-to, 
.route-leave-from {
   opacity: 1;
   transform: translateY(0);
}

.route-enter-active {
   transition: all 0.3 ease-out;
}

.route-leave-active {
   transition: all 0.3 ease-in;
}
</style>