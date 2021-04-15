import {createWebHistory, createRouter} from "vue-router";
import Force from '../components/force-graph/force.vue';

const routes = [
    {
        path: "/",
        name: "Home",
        component: Force,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
