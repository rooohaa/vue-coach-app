export default {
   async registerCoach(context, data) {
      const userId = context.rootGetters.userId
      const coachData = {
         firstName: data.first,
         lastName: data.last,
         areas: data.areas,
         description: data.descr,
         rate: data.rate
      }

      const token = context.rootGetters.token

      const res = await fetch(`https://coach-app-c0da7-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=${token}`, 
      {
         method: 'PUT',
         body: JSON.stringify(coachData)
      })

      // const resData = await res.json()
      
      if (!res.ok) {
         // error...
      }

      context.commit('registerCoach', {
         ...coachData,
         id: userId
      })
   },
   async loadCoaches(context, payload) {  
      if (!payload.forceRefresh && !context.getters.shouldUpdate) {
         return
      }

      const res = await fetch(`https://coach-app-c0da7-default-rtdb.firebaseio.com/coaches.json`)

      const data = await res.json() 
      
      if (!res.ok) {
         const err = new Error(data.message || 'Failed to fetch data...')
         throw err
      }

      const coaches = []

      for (const key in data) {
         const coach = {
            id: key,
            firstName: data[key].firstName,
            lastName: data[key].lastName,
            areas: data[key].areas,
            description: data[key].description,
            rate: data[key].rate
         }
         coaches.push(coach)
      }

      context.commit('setCoaches', coaches)
      context.commit('setFetchTimestamp')
   }
}