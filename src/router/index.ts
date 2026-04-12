import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/Home.vue";
import ApiDocs from "../components/ApiDocs.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/apidocs", name: "Api Docs", component: ApiDocs }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;