<template lang="pug">

section.brief-standard.container.brief        
    //- Если нету входного параметра type то по умолчанию 
    //- генерируется input(type text) и прочее
    //- В другом случае можно указывать textarea или chechbox
    //- checkbox отделен так разметка сильно отличается
    form(@submit="formSubmit")        
        form-part(                
                v-for="(item,index) in settingsAll"                
                :key="`briefstandard-${index}`"    
                :title="item.settingsTitle"            
            )            
            form-part-item(
                v-for="(childItem,childIndex) in item.settingsData"                
                :key="`briefstandard-settings-data-${childIndex}`"                
                :settings="childItem"                   
                :type="childItem.type"
                :vModel.sync="childItem.vModel"              
            )             

        .form-submit#form-submit
            button(type="submit" :disabled="submitButtonState" class="form-submit as-button") {{formButtonText}}

    base-modal-success(:modalState="submitModalState" 
                       @toggle-modal-success="toggleModalSuccess")   
                                                                                                                       
    //- button(@click="debug2") Debug                
</template>

<script>
import FormPart from "@/components/FormPart";
import FormPartItem from "@/components/FormPartItem";
import axios from "axios";
import VueScrollTo from "vue-scrollto";
import { mapMutations } from "vuex";

export default {
    components: {
        FormPart,
        FormPartItem
    },
    data() {
        return {
            settingsAll: [
                {
                    settingsTitle: "Контактные данные",
                    settingsData: require("@/assets/json/settingsForContactsData.json")
                },
                {
                    settingsTitle: "Общая информация",
                    settingsData: require("@/assets/json/settingsForGeneralInformation")
                },
                {
                    settingsTitle: "Веб-сайт",
                    settingsData: require("@/assets/json/settingsForWebsite.json")
                },
                {
                    settingsTitle: "Дизайн и материалы",
                    settingsData: require("@/assets/json/settingsForDesign.json")
                },
                {
                    settingsTitle: "Комплексные задачи",
                    settingsData: require("@/assets/json/settingsForComplexTasks.json")
                },
                {
                    settingsTitle: "Файлы и примеры",
                    settingsData: require("@/assets/json/settingsForFiles.json")
                }
            ],
            // Настройки формы
            formButtonText: "Завершить и отправить",
            submitModalState: false,
            submitButtonState: false
        };
    },
    computed: {
        // Вытаскиваем из главного массива только значения input type file
        formDataFiles() {
            // берем только объект с заголовком файлы и примеры
            let onlyTitleFile = [...this.settingsAll].pop();
            // Получаем только определенный vModel
            onlyTitleFile = { ...onlyTitleFile.settingsData };
            return onlyTitleFile[1].vModel;
        },
        // Валидация чекбоксов или радио и скролл до элементов
        findEmptyItem() {
            const scrollToEmptyItem = item => {
                if (item.required && !item.vModel.length) {
                    this.toggleErrState("show");
                    VueScrollTo.scrollTo(`#${item.anchorId}`, 500);
                    return false;
                }
                return true;
            };
            // Создаем пустой массив в котором будут храниться только чекбоксы или радио
            let isFound = [];
            // Получаем только settingsData и объединяем в isFound
            this.settingsAll.map(item => {
                // Фильтруем только vmodel типа array
                const onlyArrayVmodel = item.settingsData.filter(
                    child => child.vModel instanceof Array
                );
                // Вмещаем фильтрованные данные в массив isfound
                isFound = isFound.concat(onlyArrayVmodel);
            });
            // Валидируем полученные чекбоксы и радио
            isFound = isFound.every(scrollToEmptyItem);
            // Если валидация всех форм успешна то возвращает true, если нет то false
            return isFound;
        }
    },
    watch: {
        // Слежение за массивом settingsAll, при изменении записывать
        // в localstorage.settingsAll
        settingsAll: {
            handler(val) {
                localStorage.briefStandard = JSON.stringify(val);
            },
            deep: true
        }
    },
    mounted() {
        // Авто высота textarea, библиотека подключена через public index.html script
        // eslint-disable-next-line
        autosize(document.querySelectorAll("textarea"));
        // Если в localstorage есть значение то переписываем settingsAll
        if (localStorage.briefStandard) {
            let storageArr = JSON.parse(localStorage.briefStandard);
            // Значение this.settingsAll заменять на localstorage.settingsAll
            // чтобы при перезагрузке все сохранялось
            this.settingsAll.map((item, index) => {
                item.settingsData.map((childItem, childIndex) => {
                    // Берем только vModel
                    let storageVModel =
                        storageArr[index].settingsData[childIndex].vModel;
                    childItem.vModel = storageVModel;
                });
            });
        }
    },
    methods: {
        debug2() {},
        formSubmit(e) {
            e.preventDefault();
            if (this.findEmptyItem) {
                this.formButtonText = "Идет загрузка...";
                this.submitButtonState = true;
                this.sendData();
                localStorage.removeItem("briefStandard");
            }
        },
        sendData() {
            const formData = new FormData(),
                files = this.formDataFiles,
                config = {
                    headers: { "Content-Type": "multipart/form-data" }
                };

            if (files.length) {
                for (let i = 0; i < files.length; i++) {
                    formData.append("files", files[i]);
                }
            }

            const jsonData = JSON.stringify(this.settingsAll);
            formData.append("settingsAll", jsonData);

            axios
                .post("/api/upload", formData, config)
                .then(res => {
                    this.formButtonText = "Заявка отправлена";
                    this.submitModalState = true;
                    console.log(res);
                })
                .catch(err => {
                    this.formButtonText = "Произошла ошибка, обновите страницу";
                    console.log(err);
                });
        },
        toggleModalSuccess() {
            this.submitModalState = !this.submitModalState;
            location.reload();
        },
        ...mapMutations(["toggleErrState", "routerViewStateLoaded"])
    }
};
</script>
