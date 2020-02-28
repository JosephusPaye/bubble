<template>
  <div
    id="app"
    class="h-screen text-sm grid grid-rows-2 grid-cols-1 lg:text-base lg:grid-rows-1 lg:grid-cols-2 bg-gray-500 gap-px"
  >
    <Editor v-model="code" :errors="errors" :analysis="analysis" />
    <Preview :ast="ast" :style-tree="styleTree" :analysis="analysis" />
  </div>
</template>

<script>
import debounce from 'debounce';
import * as parser from '@josephuspaye/bubble';

import Editor from './components/Editor.vue';
import Preview from './components/Preview.vue';

const parse = debounce((input, callback) => {
  try {
    const ast = bubble.parse(input);
    callback({ valid: true, ast });
  } catch (err) {
    callback({ valid: false, errors: [err] });
  }
}, 300);

export default {
  name: 'App',
  components: {
    Editor,
    Preview,
  },
  data() {
    return {
      code: `
node:myLoad "Load"
node:myProcess "Process" [Runs the database queries]
branch "Question?" {
  when "Yes" {
    node "Yes 1"
    branch:mySecondBranch "Another question?" [Yep, you can nest branches] {
      when "Yes" { node "Do something" }
      when "No" {  }
    }
  }
  when "No" {
    node "No 1"
    node "No 2"
  }
}

node "" []
branch "" [] {}

appearance {
  @myLoad,
  @myProcess {
    shape: ellipse;
    style: 1, +fill, -border, -shadow;
  }

  @myProcess {
    style: 2;
  }

  @fake, node { shape: rectangle; }
  branch { style: 3; }
}
      `.trim(),
      ast: {},
      analysis: {},
      styleTree: [],
      errors: [],
    };
  },
  watch: {
    code(input) {
      this.parseCode();
    },
  },
  mounted() {
    this.parseCode();
  },
  methods: {
    parseCode() {
      parse(this.code, this.onParse);
    },
    onParse({ ast, valid, errors }) {
      if (valid) {
        this.ast = ast;
        this.errors = [];
        this.analysis = bubble.analyse(ast);
        this.styleTree = bubble.resolveStyles(ast);
      } else {
        console.error('Parse error', errors);
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
