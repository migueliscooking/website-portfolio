import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [freq, setFreq] = useState(440);
  const [volume, setVolume] = useState(0.2);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.ctx.close();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleNote = async () => {
    if (!audioRef.current) {
      const ctx = new AudioContext();
      await ctx.audioWorklet.addModule('/synth.js');

      const node = new AudioWorkletNode(ctx, 'inline-synth');
      node.connect(ctx.destination);

      audioRef.current = { ctx, node };
    }

    const { ctx, node } = audioRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const next = !isPlaying;
    setIsPlaying(next);
    node.port.postMessage({
      isPlaying: next,
      frequency: freq,
      volume: volume,
    });
  };

  const handleFreqChange = (e) => {
    const nextFreq = Number(e.target.value);
    setFreq(nextFreq);
    audioRef.current?.node.port.postMessage({ frequency: nextFreq });
  };

  const handleVolumeChange = (e) => {
    const nextVolume = Number(e.target.value);
    setVolume(nextVolume);
    audioRef.current?.node.port.postMessage({ volume: nextVolume });
  };

  return (
    <section id="center">
      <h1>Raw Buffer Synth</h1>

      <button type="button" onClick={toggleNote}>
        {isPlaying ? 'Stop Tone' : 'Play Tone'}
      </button>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Frequency: {freq} Hz
          <input
            type="range"
            min="110"
            max="880"
            value={freq}
            onChange={handleFreqChange}
          />
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Volume: {Math.round(volume * 100)}%
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </label>
      </div>
    </section>
  );
}

export default App;
