<template>
  <div class="h-full bg-white grid" style="grid-template-rows: 56px 1fr;">
    <div class="flex p-3">
      <button
        class="px-4 py-1"
        :class="[view === 'ast' ? 'bg-blue-600 text-white' : 'bg-gray-300']"
        @click="view = 'ast'"
      >AST</button>
      <button
        class="px-4 py-1 ml-px"
        :class="[
          view === 'analysis' ? 'bg-blue-600 text-white' : 'bg-gray-300',
        ]"
        @click="view = 'analysis'"
      >Analysis</button>
      <button
        class="px-4 py-1 ml-px"
        :class="[
          view === 'style-tree' ? 'bg-blue-600 text-white' : 'bg-gray-300',
        ]"
        @click="view = 'style-tree'"
      >Style Tree</button>
    </div>
    <pre
      class="bg-gray-200 p-3 overflow-y-auto overflow-x-auto text-sm"
      v-text="JSON.stringify(displayData, null, '  ')"
    ></pre>
  </div>
</template>

<script>
export default {
  name: 'Preview',
  props: {
    ast: Object,
    analysis: Object,
    styleTree: Array,
  },
  data() {
    return {
      view: 'ast',
    };
  },
  computed: {
    displayData() {
      if (this.view === 'ast') {
        return this.ast;
      } else if (this.view === 'analysis') {
        return this.analysis;
      } else if (this.view === 'style-tree') {
        return this.styleTree;
      }
      return null;
    },
  },
};
</script>
