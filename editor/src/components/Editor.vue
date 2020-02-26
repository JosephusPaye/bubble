<template>
  <div
    class="flex flex-col border-2 border-transparent bg-gray-400"
    :class="{ 'border-red-300': invalid }"
  >
    <MonacoEditor
      class="editor w-full flex-grow"
      language="bubble"
      ref="editor"
      v-model="code"
      @change="onEditorChange"
      @editorDidMount="editorDidMount"
    />
    <div class="bg-red-300" v-if="invalid">
      <div class="py-4 px-5" :key="index" v-for="(error, index) in errors">
        {{ errorToString(error) }}
      </div>
    </div>
  </div>
</template>

<script>
import MonacoEditor from 'vue-monaco';
import { syntaxDefinition } from '../syntax';

export default {
  name: 'Editor',
  components: {
    MonacoEditor,
  },
  props: {
    value: String,
    errors: Array,
  },
  data() {
    return {
      code: this.value,
    };
  },
  computed: {
    invalid() {
      return this.errors.length > 0;
    },
  },
  watch: {
    value() {
      this.code = this.value;
    },
  },
  methods: {
    focus() {
      this.$refs.input && this.$refs.input.focus();
    },
    errorToString(error) {
      if (!error.location) {
        console.log(error);
        return error.message;
      }
      const { line, column } = error.location.start;
      return `Ln ${line}, Col ${column}: ${error.message}`;
    },
    editorDidMount() {
      const monaco = this.$refs.editor.monaco;
      monaco.languages.register({ id: 'bubble' });
      monaco.languages.setMonarchTokensProvider('bubble', syntaxDefinition);
    },
    onEditorChange(value) {
      this.$emit('input', value);
    },
  },
};
</script>
