<template lang="pug">

-
    var info = {
        title: [
            { text: '<span>Благодарим Вас </span> за обращение и предлагаем Вам заполнить Бриф на разработку дизайна.' },
            { text: '*Бриф — краткая письменная форма согласительного порядка между, планирующими сотрудничать, сторонами, в которой прописываются основные параметры будущего программного, графического, медийного или какого-либо иного проекта.' },
            { text: `Если для вас удобнее заполнить бриф в виде документа, 
                     можете <a href="./Пример брифа.docx" download>скачать бриф </a> в формате .doc и прислать 
                     к нам на почту: <span> kazdevops@gmail.com </span>` }
        ],
        menuTitle: 'Бриф на разработку'
    }

mixin both
    .header__wrap.container
        .header__title
            .header__title-text
                each item in info.title
                    p !{item.text}     
            .header__title-image
            .scroll-magic-aside
        .header__menu
            .header__menu-title= info.menuTitle
            .header__menu-list
                router-link(
                    v-for="(item,index) in menu" 
                    :key="`menu-list-${index}`"    
                    :to="item.path")                         
                        | {{item.name}}
                
header.header#header    
    +both

</template>

<script>
import scrollMagicAside from "@/mixins/scrollMagicAside";

export default {
    mixins: [scrollMagicAside],
    data() {
        return {
            menu: [
                { name: "корпоративного стиля", path: "/" },
                { name: "веб-сайта", path: "" },
                { name: "мобильного приложения", path: "" }
            ]
        };
    }    
};
</script>
