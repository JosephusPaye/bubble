<template>
  <div class="p-2 px-4 h-full overflow-y-auto">
    <div class="flex mb-2">
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
    <pre>{{ JSON.stringify(view === 'ast' ? ast : analysis, null, '  ') }}</pre>
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
