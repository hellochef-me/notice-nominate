import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'notice-wall',
      component: () => import('@/views/NoticeWallPage.vue'),
      meta: { showNominateButton: true },
    },
    {
      path: '/nominate',
      name: 'nominate',
      component: () => import('@/views/NominatePage.vue'),
    },
    {
      path: '/n/:id',
      name: 'nomination-detail',
      component: () => import('@/views/NominationDetailPage.vue'),
    },
  ],
})

export default router
