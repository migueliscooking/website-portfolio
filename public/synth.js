class InlineSynth extends AudioWorkletProcessor {
  constructor() {
    super();
    this.phase = 0;
    this.frequency = 440;
    this.isPlaying = false;
    this.port.onmessage = (e) => Object.assign(this, e.data);
  }
  process(inputs, outputs) {
    const channel = outputs.at(0)?.at(0);
    if (!channel) return true;
    for (let i = 0; i < channel.length; i++) {
      channel[i] = this.isPlaying ? Math.sin(this.phase * 2 * Math.PI) * this.volume : 0;
      this.phase = (this.phase + this.frequency / sampleRate) % 1;
    }
    return true;
  }
}
registerProcessor('inline-synth', InlineSynth);