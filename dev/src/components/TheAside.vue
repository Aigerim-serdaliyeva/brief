<template lang="pug">

-
    var info = {
        alert: {
            h2: 'Вы уверенны, что хотите очистить форму?',
            p: 'Все поля формы будут очищенны, без возможности восстановления'
        }
    }
    
mixin formCleanSvg 
    <svg viewBox="0 0 44 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.502 19.09h13.75V5.454h19.25v49.094h-33V19.091zm8.25-12.506v7.05H6.626l7.124-7.05zM0 60h44V0H12.623L0 12.507V60z" fill="#CECECE"/><path d="M27.183 26l-5.698 5.7L15.79 26 12 29.801l5.697 5.697-5.697 5.7L15.79 45l5.695-5.7 5.698 5.7L31 41.198l-5.724-5.7L31 29.8 27.183 26z" fill="#CECECE"/></svg>

mixin modal
    base-modal(v-if="modalState")            
        .aside__modal                
            img(src="~@/assets/images/aside-clean.png")
            article
                h2= info.alert.h2
                p= info.alert.p
            .aside__modal-buttons
                button(@click="cleanSettingsAll") Очистить
                button(@click="toggleModal") Отмена

aside.aside#aside(:class="{ 'opacity-0': asideState }")
    .aside__wrap
        .aside__item(@click="toggleModal")
            +formCleanSvg
            p Очистить форму                    
    +modal

</template>

<script>
import { mapState } from "vuex";

export default {
    data() {
        return {
            modalState: false
        };
    },
    computed: {
        ...mapState(["asideState"])
    },
    methods: {
        cleanSettingsAll() {
            localStorage.removeItem("briefStandard");
            location.reload();
        },
        toggleModal() {
            this.modalState = !this.modalState;
        }
    }
};
</script>
