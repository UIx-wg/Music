import React from 'react';
import styled from 'styled-components';

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props: any) => props.theme.silver};
  padding: 8px 0;
  gap: 20px;
  border-bottom: 1px solid ${(props: any) => props.theme.border};
`;

const Button = styled.button<{active?: boolean}>`
  background: ${({active, theme}) => active ? theme.accent : theme.white};
  border: 1px solid ${(props: any) => props.theme.border};
  border-radius: 50%;
  width: 40px; height: 40px;
  font-size: 1.2em;
  cursor: pointer;
  outline: none;
`;

export default function TransportControls({
  isPlaying, setIsPlaying
}: {isPlaying: boolean, setIsPlaying: (b:boolean)=>void}) {
  return (
    <Controls>
      <Button title="Previous">⏮️</Button>
      <Button active={isPlaying} title="Play" onClick={()=>setIsPlaying(true)}>▶️</Button>
      <Button active={!isPlaying} title="Pause" onClick={()=>setIsPlaying(false)}>⏸️</Button>
      <Button title="Next">⏭️</Button>
      <Button title="Replay" onClick={()=>{ setIsPlaying(false); setTimeout(()=>setIsPlaying(true), 100); }}>🔁</Button>
    </Controls>
  );
}