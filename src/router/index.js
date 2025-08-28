import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/Login/LoginPage.vue'
import Dashboard from '../components/Dashboard/Dashboard.vue'
import Reports from '../components/Reports/Reports.vue'
import MainLayout from '../components/MainLayout/MainLayout.vue'
import Compliances from '../components/Compliances/Compliances.vue'
import Payments from '../components/Payments/Payments.vue'
import Applicants from '../components/Applicants/Applicants.vue'
import Stalls from '../components/Stalls/Stalls.vue'
import Stallholders from '../components/Stallholders/Stallholders.vue'

const BlankPage = {
  template: "<div><h2>This page is blank for now 🚧</h2></div>"
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginPage },

     {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: Dashboard,
          meta: { title: "Dashboard" },
        },
        {
          path: "reports",
          name: "Reports",
          component: Reports,
          meta: { title: "ReportsPage" },
        },
        {
          path: "payments",
          name: "Payments",
          component: Payments, // just blank placeholder
          meta: { title: "Payments" },
        },
        {
          path: "applicants",
          name: "Applicants",
          component: Applicants, // placeholder too
          meta: { title: "Applicants" },
        },
        {
          path: "compliances",
          name: "Compliances",
          component: Compliances, // placeholder too
          meta: { title: "Compliances" },
        },
        {
          path: "stallholders",
          name: "Stallholders",
          component: Stallholders,
          meta: { title: "Stallholders" } },
        {
          path: "vendors", name: "Vendors",
          component: BlankPage,
           meta: { title: "Vendors" } },
        {
           path: "inspectors",
          name: "Inspectors",
           component: BlankPage,
           meta: { title: "Inspectors" } },
        {
          path: "collectors",
          name: "Collectors",
          component: BlankPage,
          meta: { title: "Collectors" } },
        {
          path: "stalls",
        name: "Stalls",
        component: Stalls,
        meta: { title: "Stalls" } },
      ],
    },
  ],
})

export default router
