import JobDetailsVue from "../views/JobDetails.vue"
import HomeVue from "../views/Home.vue"
import {createRouter,createWebHistory} from "vue-router"


const router = createRouter({
    history: createWebHistory(import.meta.env.Base_URL),
    routes: [
        {
            path :"/" ,
            name: "home",
            component: HomeVue

        },
        {
            path :"/details/:id" ,
            name: "jobDetail",
            component: JobDetailsVue

        }
    ]
})

export default router