import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = () =>
    new Vuex.Store({
        state: {
            errState: false,
            routerViewState: false,
            asideState: true
        },
        mutations: {
            toggleErrState(state, task) {
                // Если есть нагрузка то он только показывает или только скрывает
                if (task) {
                    task === "show"
                        ? (state.errState = true)
                        : (state.errState = false);
                    return;
                }
                // Если нету нагрузки идет простой toggle
                state.errState = !state.errState;
            },
            toggleAsideState(state) {
                state.asideState = !state.asideState;
            }
        }
    });

export default store;
