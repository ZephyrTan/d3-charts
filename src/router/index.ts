import {createWebHistory, createRouter} from "vue-router";
import Force from '../components/force-graph/force-graph.vue';

const routes = [
    {
        path: "/",
        name: "Force",
        component: Force,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
