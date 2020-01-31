<template lang="pug">

.form-part__item(:class="settings.classParent" :id="settings.anchorId")
    h3
        | {{settings.title}}
        span.span-required(v-if="settings.required") *
        span(v-if="settings.classSpan" :class="settings.classSpan") 
            | {{settings.span}}

    //- Обычный инпут type text, tel email
    template(v-if="type === 'inputDefault'")
        input(
            v-bind="settings.itemAttr" 
            @input="onChange($event, 'default')" 
            :value="vModel"                    
            :required="settings.required"            
        )                

    //-  textarea
    template(v-else-if="type === 'textarea'")
        textarea(
                v-bind="settings.itemAttr" 
                @input="onChange($event, 'default')" 
                ref="textarea"
                :value="vModel" 
                :required="settings.required"
            )        

    //- checkbox или radio
    template(v-else-if="type === 'checkbox' || type === 'radio'")        
        .form-part__item-checkbox(:class="settings.classCheckbox")            
            article(
                v-for="(item,index) in settings.checkboxList" 
                :key="`checkbox-list-${index}`" 
            )
                input(                    
                    :id="item.id" 
                    :type="settings.type" 
                    v-model="checked" 
                    v-bind="settings.itemAttr"
                    :value="item.text"                    
                    @change="onChange($event, 'checkbox')"                                        
                )                
                label(:for="item.id") 
                    .square
                    | {{item.text}}    

        //- Поле ошибки
        form-part-item-empty-err(
            v-if="!vModel.length && settings.required && errState"
            :errText="settings.errText"
        )                                    

    //- file
    template(v-else)
        mixin svgButton
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.2 9.467l-1.867 1.866L12 18l6.667-6.667L16.8 9.467l-3.467 3.467V0h-2.666v12.867L7.2 9.466zM24 21.333V2.667C24 1.2 22.8 0 21.333 0H16v2.667h5.333v18.666H2.667V2.667H8V0H2.667A2.674 2.674 0 0 0 0 2.667v18.666C0 22.8 1.2 24 2.667 24h18.666C22.8 24 24 22.8 24 21.333z" fill="#A4A4A4"/></svg>

        mixin svgFileUploaded
            <svg viewBox="0 0 33 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M31.715 1.389v37.067H.733V10.11l9.688-8.72h21.294z" stroke="#717171" stroke-width="1.466"/><rect x="7.827" y="19.81" width="1.679" height="9.561" rx=".839" transform="rotate(-45 7.827 19.81)" fill="#CDDC39"/><rect width="1.679" height="14.912" rx=".839" transform="scale(-1 1) rotate(-45 6.79 38.37)" fill="#CDDC39"/></svg>

        mixin svgFileDelete
            //- index берется из v-for attachments
            <svg @click="deleteFiles(index)" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="15.983" y=".455" width="1.439" height="21.579" rx=".719" transform="rotate(45 15.983 .455)" fill="#FF3F3F"/><rect x=".724" y="1.894" width="1.439" height="21.579" rx=".719" transform="rotate(-45 .724 1.894)" fill="#FF3F3F"/></svg>

        .form-part__item-file             
            input(
                :id="settings.fileId"
                :type="settings.type"
                ref="itemFile"                                   
                multiple
                @change="attachFiles($event)"
            )
            article(
                v-if="attachments.length" 
                v-for="(item,index) in attachments" 
                :key="`attachments-${index}`"
            )
                +svgFileUploaded
                p {{item.name}}    
                +svgFileDelete      
            .w-100
                label.as-button(:for="settings.fileId")
                    | Прикрепить
                    +svgButton                 
                      
</template>

<script>
import { mapState } from "vuex";
import FormPartItemEmptyErr from "@/components/FormPartItemEmptyErr";

// Логика для имитации v-model для checkbox и radio
const mixinForCheckboxAndRadio = {
    data() {
        return {
            checkedProxy: []
        };
    },
    computed: {
        checked: {
            get() {
                return this.vModel;
            },
            set(val) {
                this.checkedProxy = val;
            }
        }
    }
};

// Логика для имитации v-model для input file
const mixinForFile = {
    data() {
        return {
            attachments: []
        };
    },
    methods: {
        attachFiles(e) {
            const selectedFiles = e.target.files;
            if (!selectedFiles.length) {
                return false;
            }
            for (let i = 0; i < selectedFiles.length; i++) {
                this.attachments.push(selectedFiles[i]);
            }
            this.$emit("update:vModel", this.attachments);
        },
        deleteFiles(index) {
            this.attachments.splice(index, 1);
        }
    }
};

export default {
    components: {
        FormPartItemEmptyErr
    },
    mixins: [mixinForCheckboxAndRadio, mixinForFile],
    props: {
        settings: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            required: false,
            default: "inputDefault"
        },
        vModel: [String, Array, File]
    },
    computed: {
        ...mapState(["errState"])
    },
    methods: {
        // Логика для имитации v-model для input type text,tel,email, checkbox, radio
        onChange(e, type) {
            type === "default"
                ? this.$emit("update:vModel", e.target.value)
                : this.$emit("update:vModel", this.checkedProxy);
        }
    }
};
</script>
