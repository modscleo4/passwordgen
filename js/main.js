'use strict';

import * as Vue from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.5/vue.esm-browser.prod.js';

function importScript(src) {
    const script = document.createElement('script');
    script.src = src;

    document.body.appendChild(script);

    return script;
}

window.addEventListener('appinstalled', () => {
    console.log('A2HS installed');
});

/**
 * @type {Worker|undefined}
 */
let worker;

let stockfish;

const app = Vue.createApp({
    data: () => ({
        modal: null,
        forceUpdate: 0,
        passwordLength: 16,
        useUppercase: true,
        useNumbers: true,
        useSpecial: true,

        config: {
            get theme() {
                return localStorage.getItem('theme') ?? 'system';
            },

            set theme(val) {
                localStorage.setItem('theme', val);
                document.querySelector('html')?.setAttribute('theme', val);
            },
        },
    }),

    computed: {
        password() {
            if (this.forceUpdate) {

            }

            const letters = 'abcdefghijklmnopqrstuvwxyz';
            const letters_uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const numbers = '0123456789';
            const symbols = '!#$%&()*+,-./:;<=>?@[\]^_{|}~';

            let chars = letters + letters;
            this.useUppercase && (chars += letters_uppercase) && (chars += letters_uppercase);
            this.useNumbers && (chars += numbers) && (chars += numbers);
            this.useSpecial && (chars += symbols);

            let array = new Uint8Array(this.passwordLength);
            crypto.getRandomValues(array);
            array = array.map(v => v %= chars.length);

            return Array.from(array).map(v => chars[v]).join('');
        }
    },

    methods: {
        /**
         *
         * @param {string} str
         */
        copyToClipboard(str) {
            navigator.clipboard.writeText(str);
        },

        generate() {
            this.forceUpdate++;
        }
    },
}).mount('#app');
