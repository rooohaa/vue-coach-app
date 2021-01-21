export default {
   async contactCoach(context, payload) {
      const newRequest = {
         userEmail: payload.email,
         message: payload.message
      }
      
      const res = await fetch(`https://coach-app-c0da7-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`, {
         method: 'POST',
         body: JSON.stringify(newRequest)
      }) 

      const resData = await res.json()

      if (!res.ok) {
         throw new Error(resData.message || 'Failed to post data...')
      }

      newRequest.id = resData.name
      newRequest.coachId = payload.coachId

      context.commit('addRequest', newRequest)
   },
   async fetchRequests(context) {
      const coachId = context.rootGetters.userId
      const token = context.rootGetters.token

      const res = await fetch(`https://coach-app-c0da7-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=${token}`)

      const resData = await res.json()

      if (!res.ok) {
         throw new Error(resData.message || 'Failed to fetch requests...')
      }

      const requests = []

      for (const key in resData) {
         const request = {
            id: key,
            coachId,
            userEmail: resData[key].userEmail,
            message: resData[key].message
         }
         requests.push(request)
      }

      context.commit('setRequests', requests)
   }
}