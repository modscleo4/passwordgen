'use strict';

import * as Vue from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.20/vue.esm-browser.prod.js';

function importScript(src) {
    const script = document.createElement('script');
    script.src = src;

    document.body.appendChild(script);

    return script;
}

window.addEventListener('appinstalled', () => {
    console.log('A2HS installed');
});

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

    mounted() {
        console.log(document.querySelector('#password_length_range').getAttribute('title'));
        // Enable all tooltips
        [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(function (el) {
            new bootstrap.Tooltip(el);
        });
    },

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
            const tooltip = new bootstrap.Tooltip(document.querySelector('#btn_copy'), {
                title: 'Copied!',
                trigger: 'manual',
                placement: 'top',
            });

            tooltip.show();

            // Wait 2 seconds then hide it.
            setTimeout(() => {
                tooltip.hide();
            }, 2000);

            navigator.clipboard.writeText(str);
        },

        generate() {
            this.forceUpdate++;
        },

        reloadSliderTooltip() {
            const slider = document.querySelector('#password_length_range');
            const tooltip = document.querySelector('#' + slider.getAttribute('aria-describedby'));
            tooltip.querySelector('.tooltip-inner').innerHTML = slider.getAttribute('title');

            // Force update tooltip
            slider.setAttribute('data-bs-original-title', slider.getAttribute('title'));
        }
    },
}).mount('#app');
