import { createApp, defineAsyncComponent } from 'vue'

import router from "@/router.js"
import store from '@/store/index.js'
import App from "@/App"

import BaseCard from '@/components/ui/BaseCard'
import BaseButton from '@/components/ui/BaseButton'
import BaseBadge from '@/components/ui/BaseBadge'
import BaseSpinner from '@/components/ui/BaseSpinner'

const BaseDialog = defineAsyncComponent(() => import('@/components/ui/BaseDialog.vue'))

const app = createApp(App)

app.use(router)
app.use(store)

app.component('base-card', BaseCard)
app.component('base-button', BaseButton)
app.component('base-badge', BaseBadge)
app.component('base-spinner', BaseSpinner)
app.component('base-dialog', BaseDialog)

app.mount('#app')
