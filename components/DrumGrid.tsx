import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';
import { saveAs } from 'file-saver';

const DRUMS = [
  {name: 'Kick', midi: 36, color: '#f44336'},
  {name: 'Snare', midi: 38, color: '#4caf50'},
  {name: 'HiHat', midi: 42, color: '#2196f3'},
  {name: 'Clap', midi: 39, color: '#ff9800'},
];
const STEPS = 16;

const DrumGridWrap = styled.div`
  margin: 16px 0;
  border: 1px solid ${(props: any) => props.theme.border};
  background: ${(props: any) => props.theme.bar};
  border-radius: 8px;
  overflow-x: auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 64px repeat(${STEPS}, 32px);
`;

const RowLabel = styled.div`
  width: 64px;
  background: ${(props: any) => props.theme.silver};
  text-align: right;
  padding: 0 6px;
  font-size: 0.9em;
`;

const Cell = styled.div<{active: boolean, color: string}>`
  width: 32px; height: 32px;
  background: ${({active, color, theme}) => active ? color : theme.white};
  border: 1px solid ${({theme}) => theme.border};
  cursor: pointer;
  transition: background 0.15s;
`;

const Controls = styled.div`
  display: flex; gap: 12px; margin: 8px 0;
`;

export default function DrumGrid({ isPlaying }: { isPlaying: boolean }) {
  const [grid, setGrid] = useState<boolean[][]>(() =>
    DRUMS.map(() => Array(STEPS).fill(false))
  );
  const [step, setStep] = useState<number>(-1);

  useEffect(() => {
    let part: Tone.Part | null = null;
    if (isPlaying) {
      const players = {
        Kick: new Tone.MembraneSynth().toDestination(),
        Snare: new Tone.NoiseSynth({type:'white'}).toDestination(),
        HiHat: new Tone.MetalSynth().toDestination(),
        Clap: new Tone.NoiseSynth({type:'pink'}).toDestination(),
      };
      part = new Tone.Part((time, val) => {
        setStep(val.step);
        DRUMS.forEach((d, i) => {
          if (grid[i][val.step]) {
            if (d.name === 'Kick') players.Kick.triggerAttackRelease('C1', '8n', time);
            if (d.name === 'Snare') players.Snare.triggerAttackRelease('8n', time);
            if (d.name === 'HiHat') players.HiHat.triggerAttackRelease('16n', time);
            if (d.name === 'Clap') players.Clap.triggerAttackRelease('16n', time);
          }
        });
      },
        Array.from({length: STEPS}, (_, stepIdx) => ({
          time: `0:0:${stepIdx}`,
          step: stepIdx
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

  function exportMidi() {
    const midi = new Midi();
    const track = midi.addTrack();
    for (let step = 0; step < STEPS; ++step) {
      for (let i = 0; i < DRUMS.length; ++i) {
        if (grid[i][step]) {
          track.addNote({
            midi: DRUMS[i].midi,
            time: step * 0.25,
            duration: 0.2
          });
        }
      }
    }
    const blob = new Blob([midi.toArray()], { type: 'audio/midi' });
    saveAs(blob, 'drum-grid.mid');
  }

  async function importMidi(ev: React.ChangeEvent<HTMLInputElement>) {
    if (!ev.target.files?.length) return;
    const file = ev.target.files[0];
    const abuf = await file.arrayBuffer();
    const midi = new Midi(abuf);
    let newGrid = DRUMS.map(() => Array(STEPS).fill(false));
    midi.tracks[0]?.notes.forEach(note => {
      let i = DRUMS.findIndex(d => d.midi === note.midi);
      let step = Math.round(note.time / 0.25);
      if (i >= 0 && step >= 0 && step < STEPS)
        newGrid[i][step] = true;
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
      <DrumGridWrap>
        <Grid>
          <div></div>
          {Array.from({length: STEPS}, (_,i) => (
            <RowLabel key={i}>{i+1}</RowLabel>
          ))}
          {DRUMS.map((d, rowIdx) => (
            <React.Fragment key={d.name}>
              <RowLabel>{d.name}</RowLabel>
              {Array.from({length: STEPS}, (_, colIdx) => (
                <Cell
                  key={colIdx}
                  color={d.color}
                  active={grid[rowIdx][colIdx]}
                  style={step === colIdx ? {borderColor:'#007AFF', boxShadow:'0 0 4px #007AFF'} : {}}
                  onClick={() => {
                    let ng = grid.map(row => row.slice());
                    ng[rowIdx][colIdx] = !ng[rowIdx][colIdx];
                    setGrid(ng);
                  }}
                />
              ))}
            </React.Fragment>
          ))}
        </Grid>
      </DrumGridWrap>
    </div>
  );
}