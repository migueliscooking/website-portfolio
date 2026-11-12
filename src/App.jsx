import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import './App.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [freq, setFreq] = useState(440);
  const synthRef = useRef(null);

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
    };
  }, []);

  const toggleNote = async () => {
    await Tone.start();
    await Tone.getContext().resume();

    if (!synthRef.current) {
      synthRef.current = new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: {
          attack: 0.05,
          decay: 0.2,
          sustain: 0.8,
          release: 0.3,
        },
      }).toDestination();
    }

    if (!isPlaying) {
      synthRef.current.triggerAttack(freq);
      setIsPlaying(true);
    } else {
      synthRef.current.triggerRelease();
      setIsPlaying(false);
    }
  };

  const handleFreqChange = (e) => {
    const nextFreq = Number(e.target.value);
    setFreq(nextFreq);
    if (synthRef.current) {
      synthRef.current.frequency.value = nextFreq;
    }
  };

  return (
    <section id="center">
      <h1>Tone.js Synth</h1>

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
    </section>
  );
}

export default App;
