import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: '/asset',
      children: [
        {
          path: "/asset",
          component: () => import("@/views/asset/index.vue"),
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  next()
})
export default router;
