import debounce from 'debounce';

export default {
  mounted() {
    this.windowResizeListener = debounce(() => {
      this.$emit('window-resize');
    }, 300);

    window.addEventListener('resize', this.windowResizeListener);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.windowResizeListener);
  },
};
