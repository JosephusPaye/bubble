<template>
  <div class="p-2 px-4 h-full overflow-y-auto">
    <pre v-if="ast">{{ JSON.stringify(ast, null, '  ') }}</pre>
    <span v-else>Preview</span>
  </div>
</template>

<script>
export default {
  name: 'Preview',
  props: {
    ast: Object,
  },
};
</script>
