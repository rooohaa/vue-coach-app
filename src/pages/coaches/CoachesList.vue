<template>
   <div>
      <base-dialog :show="!!error" title="An error ocured!" @close="handleError">
         <p>{{ error }}</p>
      </base-dialog>
      <section>
         <coach-filter @change-filter="setFilters"></coach-filter>
      </section>

      <section>
         <base-card>
            <div class="controls">
               <base-button mode="outline" @click="loadCoaches(true)">
                  Refresh
               </base-button>
               
               <base-button link to="/auth?redirect=register" v-if="!isLoggedIn">
                  Login to Register as a Coach
               </base-button>
               
               <base-button 
                  v-if="!isCoach && !isLoading && isLoggedIn" 
                  to="/register" 
                  link>
               Register as a Coach
               </base-button>
            </div>

            <div v-if="isLoading">
               <base-spinner></base-spinner>
            </div>

            <ul v-else-if="hasCoaches">
               <coach-item 
                  v-for="coach in filteredCoaches" 
                  :key="coach.id"
                  :id="coach.id"
                  :firstName="coach.firstName"
                  :lastName="coach.lastName"
                  :rate="coach.rate"
                  :areas="coach.areas">
               </coach-item>
            </ul>

            <h3 v-else>You have no coaches yet...</h3>
         </base-card>
      </section>
   </div>
</template>

<script>
import CoachItem from '../../components/coaches/CoachItem'
import CoachFilter from '../../components/coaches/CoachFilter'

export default {
   components: {
      CoachItem,
      CoachFilter
   },
   data() {
      return {
         isLoading: false,
         error: null,
         activeFilters: {
            frontend: true,
            backend: true,
            career: true
         }
      }
   },
   computed: {
      isLoggedIn() {
         return this.$store.getters.isAuthenticated 
      },
      filteredCoaches() {
         const coaches = this.$store.getters['coaches/coaches']
         return coaches.filter(coach => {
            if (this.activeFilters.frontend && coach.areas.includes('frontend')) {
               return true
            }

            if (this.activeFilters.backend && coach.areas.includes('backend')) {
               return true
            }

            if (this.activeFilters.career && coach.areas.includes('career')) {
               return true
            }
            return false
         })
      },
      hasCoaches() {
         return !this.isLoading && this.$store.getters['coaches/hasCoaches']
      },
      isCoach() {
         return this.$store.getters['coaches/isCoach']
      }
   },
   created() {
      this.loadCoaches()
   },
   methods: {
      setFilters(updatedFilters) {
         this.activeFilters = updatedFilters
      },
      async loadCoaches(refresh = false) {
         this.isLoading = true
         try {
            await this.$store.dispatch('coaches/loadCoaches', {forceRefresh: refresh})
         } catch(err) {
            this.error = err.message || 'Something went wrong...'            
         }
         this.isLoading = false
      },
      handleError() {
         this.error = null
      }
   }  
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>