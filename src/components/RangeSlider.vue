<template>
  <div>
    <label>Amplitude</label>
    <div class="range-div">
      <input
        class="range"
        type="range"
        v-model="value"
        :min="min"
        :max="max"
        @input="updateThumbPosition"
      />
      <div class="range-thumb" :style="{ left: thumbPosition + 'px' }">
        {{ displayText }}
      </div>
    </div>

    <input  class= "number" type="number" v-model.number="value" :min="min" :max="max" @input="updateThumbPosition" />
  </div>
</template>

<script>
export default {
  props: {
    amplitude: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      value: this.amplitude,
      min: 1,
      max: 10,
      thumbPosition: 1,
      displayText: '1',
    };
  },
  methods: {
    updateThumbPosition() {
      const w = this.$el.offsetWidth;
      const val = parseInt(this.value, 10);
      const max = parseInt(this.max, 10);
      const tw = 40;
      const txt = val >= max ? '10' : val;
      const xPX = (val * (w - tw)) / max;

      this.thumbPosition = xPX;
      this.displayText = txt;

      this.$emit('amplitudeChange', this.value);
    },
  },
  mounted() {
    this.updateThumbPosition();

    window.addEventListener('resize', () => {
      this.updateThumbPosition();
    });

    // Calculate on load
    this.$nextTick(() => {
      this.updateThumbPosition();
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', () => {
      this.updateThumbPosition();
    });
  },
  watch: {
    amplitude(newAmplitude) {
      this.value = newAmplitude;
      this.updateThumbPosition();
    },
  },
};
</script>
<style scoped>
.range-div {
  position: relative;
  margin-bottom: 20px;
  margin-top: 10px;
}

.range {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #f2f3f5;
  width: 100%;
  height: 10px;
  border: 2px solid #b2b3b4;
  border-radius: 3px;
}

.number{
  width: 100%;
  height: 25px;
  border: 2px solid #b2b3b4;
  border-radius: 5px;
  background: #e6e6e6;

}

.range::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  height: 20px;
  width: 40px;
  background: #dcdedf;
  border: 2px solid #b2b3b4;
  border-radius: 5px;
  cursor: grab;
}

.range-thumb {
  position: absolute;
  top: 0px;
  right: 85%;
  transform: translateX(60%);
  height: 30px;
  color: #000000;
  line-height: 30px;
  font-size: 12px;
  pointer-events: none;
}
</style>
