import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { saveAs } from 'file-saver';

const RecorderWrap = styled.div`
  margin: 16px 0;
  border: 1px solid ${(props: any) => props.theme.border};
  background: ${(props: any) => props.theme.bar};
  border-radius: 8px;
  padding: 16px;
`;

const Controls = styled.div`
  display: flex; gap: 8px; margin-bottom: 8px;
`;

const Canvas = styled.canvas`
  display: block;
  width: 100%; max-width: 600px; height: 80px;
  background: ${(props: any) => props.theme.row};
  border-radius: 6px;
  margin-bottom: 8px;
`;

export default function AudioRecorder({ isPlaying }: { isPlaying: boolean }) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Recording
  async function startRecording() {
    setAudioUrl(null);
    setAudioData(null);
    setAudioBuffer(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    audioChunks.current = [];
    mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
      setAudioData(blob);
      setAudioUrl(URL.createObjectURL(blob));
      // Decode for waveform
      const ctx = new AudioContext();
      const arrBuf = await blob.arrayBuffer();
      ctx.decodeAudioData(arrBuf, buf => setAudioBuffer(buf));
    };
    mediaRecorder.current.start();
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorder.current?.stop();
    setRecording(false);
  }

  // Draw waveform when audioBuffer changes
  React.useEffect(() => {
    if (!audioBuffer || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#b0b3b8';
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / canvas.width);
    const amp = canvas.height / 2;
    for (let i = 0; i < canvas.width; i++) {
      let min = 1, max = -1;
      for (let j=0; j<step; ++j) {
        let datum = data[(i*step)+j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.fillRect(i, (1+min)*amp, 1, Math.max(1,(max-min)*amp));
    }
  }, [audioBuffer]);

  function exportAudio() {
    if (audioData) saveAs(audioData, 'recording.webm');
  }

  function importAudio(ev: React.ChangeEvent<HTMLInputElement>) {
    if (!ev.target.files?.length) return;
    const file = ev.target.files[0];
    setAudioUrl(URL.createObjectURL(file));
    setAudioData(file);
    const ctx = new AudioContext();
    file.arrayBuffer().then(arrBuf =>
      ctx.decodeAudioData(arrBuf, buf => setAudioBuffer(buf))
    );
  }

  return (
    <RecorderWrap>
      <Controls>
        {!recording && <button onClick={startRecording}>Record</button>}
        {recording && <button onClick={stopRecording}>Stop</button>}
        <button onClick={exportAudio} disabled={!audioData}>Export</button>
        <label>
          Import
          <input type="file" accept="audio/*" style={{display:'none'}} onChange={importAudio} />
        </label>
      </Controls>
      <Canvas ref={canvasRef} width={600} height={80} />
      {audioUrl && (
        <audio ref={audioRef} controls src={audioUrl} style={{width:'100%'}} />
      )}
    </RecorderWrap>
  );
}