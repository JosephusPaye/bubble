<template>
  <div
    class="flex flex-col border-2 border-transparent bg-gray-400"
    :class="{ 'border-red-500': invalid }"
  >
    <textarea
      autofocus
      class="w-full flex-grow font-mono p-3 bg-transparent whitespace-pre resize-none outline-none"
      placeholder="Write a flowchart..."
      ref="input"
      :value="value"
      @input="$emit('input', $event.target.value)"
    ></textarea>
    <div class="bg-red-300" v-if="invalid">
      <div class="py-4 px-5" :key="index" v-for="(error, index) in errors">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Editor',
  props: {
    value: String,
    errors: Array,
  },
  computed: {
    invalid() {
      return this.errors.length > 0;
    },
  },
  methods: {
    focus() {
      this.$refs.input && this.$refs.input.focus();
    },
  },
};
</script>