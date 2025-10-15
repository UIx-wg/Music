import React, { useState } from 'react';
import styled from 'styled-components';
import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';
import { saveAs } from 'file-saver';

const KEYS = [
  'C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4',
  'C5','C#5','D5','D#5','E5','F5','F#5','G5','G#5','A5','A#5','B5'
];

const Key = styled.button<{black: boolean}>`
  width: ${({black}) => black ? 24 : 40}px;
  height: 130px;
  margin: 0 1px;
  background: ${({black, theme}) => black ? '#333' : theme.white};
  color: ${({black}) => black ? '#fff' : '#000'};
  border: 1px solid #888;
  position: relative;
  z-index: ${({black}) => black ? 2 : 1};
  border-radius: 0 0 6px 6px;
  &:active {
    background: #007aff;
    color: #fff;
  }
`;

const KeysWrap = styled.div`
  display: flex; align-items: flex-end; position: relative;
  padding: 20px 0 14px 0;
  background: ${(props: any) => props.theme.row};
  border-radius: 8px;
`;

const Controls = styled.div`
  display: flex; gap: 12px; margin: 8px 0;
`;

export default function KeyboardSynth({ isPlaying }: { isPlaying: boolean }) {
  const [notes, setNotes] = useState<{note: string, time: number}[]>([]);
  const [recording, setRecording] = useState(false);

  let synth = React.useRef<Tone.Synth | null>(null);
  if (!synth.current) synth.current = new Tone.Synth().toDestination();

  function playNote(note: string) {
    synth.current!.triggerAttackRelease(note, '8n');
    if (recording)
      setNotes(n => [...n, {note, time: Tone.now()}]);
  }

  function startRecording() {
    setRecording(true);
    setNotes([]);
  }

  function stopRecording() {
    setRecording(false);
  }

  function exportMidi() {
    const midi = new Midi();
    const track = midi.addTrack();
    if (notes.length) {
      let base = notes[0].time;
      notes.forEach(n => {
        track.addNote({
          midi: Tone.Frequency(n.note).toMidi(),
          time: n.time - base,
          duration: 0.2
        });
      });
    }
    const blob = new Blob([midi.toArray()], { type: 'audio/midi' });
    saveAs(blob, 'synth-recording.mid');
  }

  async function importMidi(ev: React.ChangeEvent<HTMLInputElement>) {
    if (!ev.target.files?.length) return;
    const file = ev.target.files[0];
    const abuf = await file.arrayBuffer();
    const midi = new Midi(abuf);
    let importedNotes: {note: string, time: number}[] = [];
    midi.tracks[0]?.notes.forEach(note => {
      importedNotes.push({note: Tone.Frequency(note.midi, "midi").toNote(), time: note.time});
    });
    setNotes(importedNotes);
  }

  function playSequence() {
    if (!notes.length) return;
    const synth = new Tone.Synth().toDestination();
    let base = notes[0].time;
    notes.forEach(n => {
      Tone.Transport.scheduleOnce(time => {
        synth.triggerAttackRelease(n.note, '8n', time);
      }, n.time - base);
    });
    Tone.Transport.start();
    setTimeout(() => Tone.Transport.cancel(), (notes[notes.length-1].time - base + 1) * 1000);
  }

  return (
    <div>
      <Controls>
        <button onClick={startRecording} disabled={recording}>Record</button>
        <button onClick={stopRecording} disabled={!recording}>Stop</button>
        <button onClick={playSequence}>Play</button>
        <button onClick={exportMidi}>Export MIDI</button>
        <label>
          Import MIDI
          <input type="file" accept=".mid,.midi" style={{display:'none'}} onChange={importMidi} />
        </label>
      </Controls>
      <KeysWrap>
        {KEYS.map(k => (
          <Key
            key={k}
            black={k.includes('#')}
            onMouseDown={() => playNote(k)}
          >{k.replace(/\d/,'')}</Key>
        ))}
      </KeysWrap>
    </div>
  );
}