<template>
  <div class="flex flex-col border-2 border-transparent bg-gray-400 relative">
    <MonacoEditor
      class="editor w-full flex-grow"
      language="bubble"
      ref="editor"
      v-model="code"
      @change="onEditorChange"
      @editorDidMount="editorDidMount"
    />
    <div
      class="py-4 px-5 bg-red-400 absolute bottom-0 left-0 right-0"
      :key="index"
      v-for="(error, index) in errors"
    >{{ errorToString(error) }}</div>
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
    analysis: Object,
  },

  data() {
    return {
      code: this.value,
      decorations: [],
      appliedDecorations: [],
    };
  },

  watch: {
    value() {
      this.code = this.value;
    },

    analysis(analysis) {
      this.updateEditorDecorations(analysis);
    },

    decorations(newDecorations) {
      this.withEditor(editor => {
        this.appliedDecorations = editor
          .getModel()
          .deltaDecorations(this.appliedDecorations, newDecorations);
      });
    },
  },

  methods: {
    onEditorChange(value) {
      this.$emit('input', value);
    },

    focus() {
      this.$refs.input && this.$refs.input.focus();
    },

    errorToString(error) {
      if (!error.location) {
        return error.message;
      }
      const { line, column } = error.location.start;
      return `Ln ${line}, Col ${column}: ${error.message}`;
    },

    editorDidMount() {
      this.editor = this.$refs.editor.getEditor();
      this.monaco = this.$refs.editor.monaco;

      this.registerBubbleLanguage();
      this.updateEditorDecorations(this.analysis);
    },

    registerBubbleLanguage() {
      this.withMonaco(monaco => {
        monaco.languages.register({ id: 'bubble' });
        monaco.languages.setMonarchTokensProvider('bubble', syntaxDefinition);
      });
    },

    updateEditorDecorations(analysis) {
      if (!analysis || !analysis.errors) {
        return;
      }

      const messages = analysis.errors.concat(analysis.warnings);

      if (messages.length === 0) {
        this.decorations = [];
        return;
      }

      const decorations = [];

      messages.forEach(message => {
        decorations.push({
          range: this.offsetToRange(
            message.location.start,
            message.location.end
          ),
          options: {
            inlineClassName:
              message.type === 'error'
                ? 'bubble-inline-error'
                : 'bubble-inline-warning',
            linesDecorationsClassName:
              message.type === 'error'
                ? 'bubble-line-error'
                : 'bubble-line-warning',
            hoverMessage: { value: message.message },
          },
        });
      });

      console.log('setting decorations', decorations);
      this.decorations = decorations;
    },

    offsetToRange(start, end) {
      return this.withMonaco(monaco => {
        return new monaco.Range(start.line, start.column, end.line, end.column);
      });
    },

    withMonaco(callback) {
      if (!this.monaco) {
        return;
      }

      return callback(this.monaco);
    },

    withEditor(callback) {
      if (!this.editor) {
        return;
      }

      return callback(this.editor);
    },
  },
};
</script>

<style lang="scss">
.bubble-inline-error,
.bubble-line-error {
  background-color: red;
}

.bubble-inline-warning,
.bubble-line-warning {
  background-color: yellow;
}
</style>
