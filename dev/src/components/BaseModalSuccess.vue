<template lang="pug">

-
    var info = {
        h2: 'Благодарим за сотрудничество!',
        p: 'Ваша заявка принята, как только мы рассмотрим её, мы обязательно свяжемся с вами!',
        h3: 'Вашу копию мы отправили на Ваш электронный адрес'
    }

base-modal(v-if="modalState")
    .base-modal-success
        img(src="~@/assets/images/form-success.png")
        article   
            h2= info.h2
            p= info.p  
            h3= info.h3
        button(@click="toggleModal") ОК

</template>

<script>
export default {
    props: {
        modalState: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        toggleModal() {
            this.$emit("toggle-modal-success");
        }
    }
};
</script>
