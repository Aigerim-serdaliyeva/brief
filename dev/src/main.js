import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
// Fontawesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// *** Plugins
import KsVueScrollmagic from "ks-vue-scrollmagic";
Vue.use(KsVueScrollmagic);

// *** Mixins
// Fontawesome
library.add(faChevronDown, faChevronUp);
Vue.component("font-awesome-icon", FontAwesomeIcon);

// *** Base automatic global components
const requireComponent = require.context(
    // Относительный путь до каталога компонентов
    "./components",
    // Обрабатывать или нет подкаталоги
    false,
    // Регулярное выражение для определения файлов базовых компонентов
    /Base[A-Z]\w+\.(vue|js)$/
);

requireComponent.keys().forEach(fileName => {
    // Получение конфигурации компонента
    const componentConfig = requireComponent(fileName);

    // Получение имени компонента в PascalCase
    const componentName = upperFirst(
        camelCase(
            // Получаем имя файла независимо от глубины вложенности
            fileName
                .split("/")
                .pop()
                .replace(/\.\w+$/, "")
        )
    );

    // Глобальная регистрация компонента
    Vue.component(
        componentName,
        // Поиск опций компонента в `.default`, который будет существовать,
        // если компонент экспортирован с помощью `export default`,
        // иначе будет использован корневой уровень модуля.
        componentConfig.default || componentConfig
    );
});

Vue.config.productionTip = false;

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount("#app");
