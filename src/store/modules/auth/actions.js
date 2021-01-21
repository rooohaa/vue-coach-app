let timer;

export default {
   async login(context, payload) {
      return context.dispatch('auth', {
         ...payload,
         mode: 'login'
      });
   },
   async signup(context, payload) {
      return context.dispatch('auth', {
         ...payload,
         mode: 'signup'
      });
   },
   async auth(context, payload) {
      const mode = payload.mode
      let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCqZOtX78htWdn1HI2Yva1euY5HCOcnUVU'

      if (mode === 'signup') {
         url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCqZOtX78htWdn1HI2Yva1euY5HCOcnUVU'
      }

      const res = await fetch(url, {
         method: 'POST',
         body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            returnSecureToken: true
         })
      });

      const resData = await res.json()
      console.log(resData);
      if (!res.ok) {
         throw new Error(resData.message || 'Failed to authenticate')
      }

      const expiresIn = +resData.expiresIn * 1000
      const expirationData = new Date().getTime() + expiresIn

      localStorage.setItem('token', resData.idToken)
      localStorage.setItem('userId', resData.localId)
      localStorage.setItem('tokenExpiration', expirationData)

      timer = setTimeout( () => {
         context.dispatch('autoLogout')
      }, expiresIn)

      context.commit('setUser', {
         token: resData.idToken,
         userId: resData.localId,
      })
   },
   tryLogin(context) {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      const tokenExpiration = localStorage.getItem('tokenExpiration')

      const expiresIn = +tokenExpiration - new Date().getTime()

      if (expiresIn < 0) {
         return   
      }

      timer = setTimeout( () => {
         context.dispatch('autoLogout')
      }, expiresIn);

      if (token && userId) {
         context.commit('setUser', {
            token,
            userId
         });
      }
   },
   logout(context) {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('tokenExpiration')

      clearTimeout(timer)

      context.commit('setUser', {
         token: null,
         userId: null
      });
   },
   autoLogout(context) {
      context.dispatch('logout')
      context.commit('didLogout')
   }
}