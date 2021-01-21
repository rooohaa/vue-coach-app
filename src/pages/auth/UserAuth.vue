<template>
   <base-dialog :show="isLoading" fixed title="Authentication">
      <base-spinner></base-spinner>
   </base-dialog>

   <base-dialog :show="!!error" title="Error occurred" @close="handleError">
      <p>{{ error }}</p>
   </base-dialog>

   <base-card>

      <form @submit.prevent="submitForm">
         <div class="form-control">
            <label for="email">Email</label>
            <input type="email" id="email" v-model.trim="email">
         </div>

         <div class="form-control">
            <label for="password">Password</label>
            <input type="password" id="password" v-model.trim="password">
         </div>

         <p v-if="!formIsValid">Please, enter a valid input fields...</p>

         <base-button>{{ authMode }}</base-button>
         <base-button
            type="button"
            mode="flat" 
            @click="switchAuthMode">
          {{ switchMode }}
          </base-button>
      </form>

   </base-card>
</template>

<script>
export default {
   data() {
      return {
         email: '',
         password: '',
         formIsValid: true,
         mode: 'login',
         isLoading: false,
         error: null   
      }
   },
   computed: {
      authMode() {
         if (this.mode === 'login') {
            return 'Login'
         } else {
            return 'Signup'
         }
      },
      switchMode() {
         if (this.mode === 'login') {
            return 'Signup instead'
         } else {
            return 'Login instead'
         }
      }
   },
   methods: {
      handleError() {
         this.error = null
      },
      clearFields() {
         this.email = ''
         this.password = ''
      },
      async submitForm() {
         if (this.email === '' || this.password.length < 6) {
            this.formIsValid = false
            return
         }
         // send http request
         this.isLoading = true

         const actionPayload = {
            email: this.email,
            password: this.password
         }

         try {
            if (this.mode === 'login') {
               await this.$store.dispatch('login', actionPayload);
               this.clearFields()
            } else {
               await this.$store.dispatch('signup', actionPayload);
               this.clearFields()
            }
            const redirectUrl = '/' + (this.$route.query.redirect || 'coaches')
            this.$router.replace(redirectUrl)
         } catch (err) {
            this.error = err.message || 'Failed to auth...'
         }

         this.isLoading = false
      },
      switchAuthMode() {
         if (this.mode === 'login') {
            this.mode = 'signup'
         } else {
            this.mode = 'login'
         }
      }
   }
}
</script>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>