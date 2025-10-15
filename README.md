# 🎼 Modern Music Sequencer App

A React + TypeScript music sequencer and recording app with a modern grey/silver/white UI, mobile auto-rotation, and the following structured features:

---

## 🎹 MIDI Piano Sequencer

- **Piano Roll Grid**: Edit MIDI notes in a vertical piano roll grid (bars as columns, notes as rows).
- **Playback & Editing**: Click cells to add/remove notes, play back the sequence in real time.
- **MIDI Export/Import**: Export your sequences as MIDI files, import existing MIDI for editing.
- **Visual Feedback**: Animated step indicator during playback.

---

## 🥁 MIDI Drum Sequencer

- **Drum Grid (Pads/Steps)**: Step-based grid for common drum sounds (Kick, Snare, Hat, Clap).
- **Playback & Editing**: Toggle drum hits per step, live playback with step highlight.
- **MIDI Export/Import**: Export drum patterns to MIDI, or import drum MIDI files.
- **Visual Feedback**: Step highlight and color-coded drums.

---

## 🎤 Audio Recorder & Visualizer

- **Audio Recording**: Record audio from your microphone in-browser.
- **Waveform Visualizer**: See a real-time waveform of your recording or imported audio.
- **Import/Export Audio**: Import audio files, export your own recordings.
- **Playback Controls**: Play, pause, and scrub through audio recordings.

---

## 🎛️ Keyboard Synthesizer (MIDI)

- **Virtual Keyboard**: On-screen keys for live performance.
- **Synth Sound Generation**: Play notes with a software synthesizer.
- **MIDI Export/Import**: Record live MIDI, export/import MIDI files for synth lines.

---

## ⬆️⬇️ Import/Export Area

- **MIDI/Audio File Import/Export**: Unified interface for importing/exporting MIDI and audio data.
- **Display File Content**: See the structure of imported files, integrate into sequencer or synth.

---

## ⏯️ Complete Transport Controls

- **Playback Control**: Play, pause, previous, next, and replay your song.
- **Global**: Controls are synchronized with all sequencer/recorder modules.

---

## 🖥️ UI & Layout

- **Bars & Rows**: All sequencer tracks are visually arranged top-to-bottom (rows) with time as columns (bars).
- **Left Sidebar**: Quick navigation between features (Piano, Drums, Recorder, Synth, Import/Export).
- **Right Sidebar**: Contextual area for editing/displaying MIDI/audio, instrument controls, or file info.
- **Responsive Design**: Mobile-friendly with auto-rotation for landscape view.  
- **Color Theme**: Elegant grey, silver, and white color palette.

---

## 📂 Project Structure

- `src/components/SidebarLeft.tsx` — Feature selector (sidebar)
- `src/components/SidebarRight.tsx` — Feature details/editor (sidebar)
- `src/components/TransportControls.tsx` — Play/pause/step/replay controls
- `src/components/PianoRoll.tsx` — MIDI piano roll sequencer
- `src/components/DrumGrid.tsx` — Step drum machine
- `src/components/AudioRecorder.tsx` — Audio recorder + visualizer
- `src/components/KeyboardSynth.tsx` — Virtual MIDI synth keyboard
- `src/theme.ts` — Color theme
- `src/App.tsx` — Main app layout and feature switching

---

## 💡 Technology

- **React + TypeScript** for UI logic
- **Tone.js** for real-time audio/MIDI synthesis and playback
- **@tonejs/midi** for MIDI import/export
- **styled-components** for theming and responsive styles
- **file-saver** for exporting audio/MIDI files

---

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npm start
   ```

---

## 📝 Feature Map

| Feature                 | Creation | Playback | Edit | Import | Export | Visualizer | Mobile |
|-------------------------|----------|----------|------|--------|--------|------------|--------|
| MIDI Piano Sequencer    | ✅        | ✅        | ✅    | ✅      | ✅      | ✅ (grid)   | ✅      |
| MIDI Drum Sequencer     | ✅        | ✅        | ✅    | ✅      | ✅      | ✅ (grid)   | ✅      |
| Audio Recorder          | ✅        | ✅        | 🚫    | ✅      | ✅      | ✅ (wave)   | ✅      |
| Keyboard Synthesizer    | ✅        | ✅        | 🚫    | ✅      | ✅      | 🚫          | ✅      |
| Import/Export Area      | ✅        | 🚫        | 🚫    | ✅      | ✅      | ✅          | ✅      |
| Transport Controls      | 🚫        | ✅        | 🚫    | 🚫      | 🚫      | 🚫          | ✅      |

---

## 📸 Screenshots

> _Add screenshots here showing each feature and the overall layout._

---

## 🏗️ Extending

- Add more drum sounds/instruments
- Advanced MIDI editing (velocity, quantize)
- Multi-track arrangements
- Audio effects & mixing

---

## 📃 License

MIT
