<template>
  <div class="flex flex-col bg-white relative">
    <div
      class="invisible absolute pointer-events-none left-0 right-0 top-0 bottom-0"
      ref="sizer"
    ></div>
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
    >
      {{ errorToString(error) }}
    </div>
  </div>
</template>

<script>
import MonacoEditor from 'vue-monaco';
import { completionsProvider } from '../editor/completions';
import { syntaxDefinition } from '../editor/syntax';
import RespondsToWindowResize from '../mixins/RespondsToWindowResize';

export default {
  name: 'Editor',

  components: {
    MonacoEditor,
  },

  mixins: [RespondsToWindowResize],

  props: {
    value: String,
    errors: Array,
    analysis: Object,
  },

  data() {
    return {
      code: this.value,
    };
  },

  watch: {
    value() {
      this.code = this.value;
    },

    analysis(analysis) {
      this.updateEditorMarkers(analysis);
    },
  },

  methods: {
    focus() {
      this.$refs.input && this.$refs.input.focus();
    },

    onEditorChange(value) {
      this.$emit('input', value);
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
      this.updateEditorMarkers(this.analysis);

      this.$on('window-resize', () => {
        this.withEditor(editor => {
          editor.layout({
            width: this.$refs.sizer.offsetWidth,
            height: this.$refs.sizer.offsetHeight,
          });
        });
      });
    },

    registerBubbleLanguage() {
      this.withMonaco(monaco => {
        monaco.languages.register({ id: 'bubble' });
        monaco.languages.setMonarchTokensProvider('bubble', syntaxDefinition);
        monaco.languages.registerCompletionItemProvider(
          'bubble',
          completionsProvider
        );
      });
    },

    updateEditorMarkers(analysis) {
      if (!analysis) {
        return;
      }

      const messages = []
        .concat(analysis.errors || [])
        .concat(analysis.warnings || []);

      this.withEditor((editor, monaco) => {
        const markers = messages.map(({ location, message, type }) => {
          return {
            startLineNumber: location.start.line,
            startColumn: location.start.column,
            endLineNumber: location.end.line,
            endColumn: location.end.column,
            message,
            severity:
              type === 'error'
                ? monaco.MarkerSeverity.Error
                : monaco.MarkerSeverity.Warning,
          };
        });

        monaco.editor.setModelMarkers(editor.getModel(), 'bubble', markers);
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

      return callback(this.editor, this.monaco);
    },
  },
};
</script>
