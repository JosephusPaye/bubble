<template>
  <div id="app" class="h-screen grid grid-rows-1 grid-cols-2">
    <Editor v-model="code" :errors="errors" />
    <Preview :ast="ast" />
  </div>
</template>

<script>
// eslint-disable-next-line
import debounce from 'debounce';
import parser from 'bubble';

import Editor from './components/Editor.vue';
import Preview from './components/Preview.vue';

console.log(parser);

const parse = debounce((input, callback) => {
  try {
    const ast = parser.parse(input);
    callback({ valid: true, ast });
  } catch (err) {
    callback({ valid: false, errors: [err] });
  }
}, 200);

export default {
  name: 'App',
  components: {
    Editor,
    Preview,
  },
  data() {
    return {
      code: '',
      ast: {},
      errors: [],
    };
  },
  watch: {
    code(input) {
      parse(this.code, this.onParse);
    },
  },
  methods: {
    onParse({ ast, valid, errors }) {
      if (valid) {
        this.ast = ast;
        this.errors = [];
        window.ast = ast;
      } else {
        console.error(errors);
        this.errors = errors;
      }
    },
  },
};
</script>

<style>
@import './assets/tailwind.css';

body {
  color: rgba(0, 0, 0, 0.87);
  @apply text-base;
}

.js-focus-visible :focus:not(.focus-visible) {
  outline: none;
}
</style>
