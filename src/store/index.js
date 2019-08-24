import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import user from "./modules/user";
import friends from "./modules/friends";
import settings from "./modules/settings";
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    auth,
    user,
    friends,
    settings
  },
  strict: debug
});
