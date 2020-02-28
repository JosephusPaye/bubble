<template>
  <div class="h-full bg-white grid" style="grid-template-rows: 56px 1fr;">
    <div class="flex p-3">
      <button
        class="px-4 py-1"
        :class="[view === 'ast' ? 'bg-blue-600 text-white' : 'bg-gray-300']"
        @click="view = 'ast'"
      >
        AST
      </button>
      <button
        class="px-4 py-1"
        :class="[
          view === 'analysis' ? 'bg-blue-600 text-white' : 'bg-gray-300',
        ]"
        @click="view = 'analysis'"
      >
        Analysis
      </button>
    </div>
    <pre
      class="bg-gray-200 p-3 overflow-y-auto overflow-x-auto text-sm"
      v-text="JSON.stringify(view === 'ast' ? ast : analysis, null, '  ')"
    ></pre>
  </div>
</template>

<script>
export default {
  name: 'Preview',
  props: {
    ast: Object,
    analysis: Object,
  },
  data() {
    return {
      view: 'ast',
    };
  },
};
</script>
