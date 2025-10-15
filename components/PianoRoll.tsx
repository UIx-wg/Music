import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';
import { saveAs } from 'file-saver';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [4, 5];
const STEPS = 16; // 16 time steps per bar

const PianoRollWrap = styled.div`
  margin: 16px 0;
  border: 1px solid ${(props: any) => props.theme.border};
  background: ${(props: any) => props.theme.bar};
  border-radius: 8px;
  overflow-x: auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 48px repeat(${STEPS}, 32px);
`;

const NoteRow = styled.div`
  display: contents;
`;

const NoteLabel = styled.div`
  width: 48px;
  background: ${(props: any) => props.theme.silver};
  text-align: right;
  padding: 0 6px;
  font-size: 0.9em;
`;

const Cell = styled.div<{active: boolean}>`
  width: 32px; height: 32px;
  background: ${({active, theme}) => active ? theme.accent : theme.white};
  border: 1px solid ${({theme}) => theme.border};
  cursor: pointer;
  transition: background 0.15s;
`;

const Controls = styled.div`
  display: flex; gap: 12px; margin: 8px 0;
`;

function midiNote(oct: number, i: number) {
  return `${NOTES[i]}${oct}`;
}

function getAllNotes() {
  let notes: string[] = [];
  for (let oct of OCTAVES) for (let i=0; i<NOTES.length; ++i)
    notes.push(midiNote(oct, i));
  return notes.reverse();
}

const ALL_NOTES = getAllNotes();

export default function PianoRoll({ isPlaying }: { isPlaying: boolean }) {
  const [grid, setGrid] = useState<boolean[][]>(() =>
    ALL_NOTES.map(() => Array(STEPS).fill(false))
  );
  const [step, setStep] = useState<number>(-1);

  // Playback
  useEffect(() => {
    let part: Tone.Part | null = null;
    if (isPlaying) {
      const synth = new Tone.PolySynth(Tone.Synth).toDestination();
      part = new Tone.Part((time, val) => {
        setStep(val.step);
        val.notes.forEach((n: string) => synth.triggerAttackRelease(n, '8n', time));
      },
        Array.from({length: STEPS}, (_, stepIdx) => ({
          time: `0:0:${stepIdx}`,
          step: stepIdx,
          notes: ALL_NOTES.filter((_, noteIdx) => grid[noteIdx][stepIdx])
        }))
      ).start(0);
      Tone.Transport.bpm.value = 120;
      Tone.Transport.start();
    } else {
      setStep(-1);
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }
    return () => {
      part?.dispose();
      Tone.Transport.stop();
      Tone.Transport.cancel();
      setStep(-1);
    };
  }, [isPlaying, grid]);

  // Export MIDI
  function exportMidi() {
    const midi = new Midi();
    const track = midi.addTrack();
    for (let step = 0; step < STEPS; ++step) {
      for (let noteIdx = 0; noteIdx < ALL_NOTES.length; ++noteIdx) {
        if (grid[noteIdx][step]) {
          track.addNote({
            midi: Tone.Frequency(ALL_NOTES[noteIdx]).toMidi(),
            time: step * 0.25, // 16th notes
            duration: 0.2
          });
        }
      }
    }
    const blob = new Blob([midi.toArray()], { type: 'audio/midi' });
    saveAs(blob, 'piano-roll.mid');
  }

  // Import MIDI (basic)
  async function importMidi(ev: React.ChangeEvent<HTMLInputElement>) {
    if (!ev.target.files?.length) return;
    const file = ev.target.files[0];
    const abuf = await file.arrayBuffer();
    const midi = new Midi(abuf);
    // Clear grid
    let newGrid = ALL_NOTES.map(() => Array(STEPS).fill(false));
    midi.tracks[0]?.notes.forEach(note => {
      let idx = ALL_NOTES.findIndex(n => Tone.Frequency(n).toMidi() === note.midi);
      let step = Math.round(note.time / 0.25);
      if (idx >= 0 && step >= 0 && step < STEPS)
        newGrid[idx][step] = true;
    });
    setGrid(newGrid);
  }

  return (
    <div>
      <Controls>
        <button onClick={exportMidi}>Export MIDI</button>
        <label>
          Import MIDI
          <input type="file" accept=".mid,.midi" style={{display:'none'}} onChange={importMidi} />
        </label>
      </Controls>
      <PianoRollWrap>
        <Grid>
          <div></div>
          {Array.from({length: STEPS}, (_,i) => (
            <NoteLabel key={i}>{i+1}</NoteLabel>
          ))}
          {ALL_NOTES.map((note, rowIdx) => (
            <NoteRow key={note}>
              <NoteLabel>{note}</NoteLabel>
              {Array.from({length: STEPS}, (_, colIdx) => (
                <Cell
                  key={colIdx}
                  active={grid[rowIdx][colIdx]}
                  style={step === colIdx ? {borderColor:'#007AFF', boxShadow:'0 0 4px #007AFF'} : {}}
                  onClick={() => {
                    let ng = grid.map(row => row.slice());
                    ng[rowIdx][colIdx] = !ng[rowIdx][colIdx];
                    setGrid(ng);
                  }}
                />
              ))}
            </NoteRow>
          ))}
        </Grid>
      </PianoRollWrap>
    </div>
  );
}