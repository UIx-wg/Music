import React, { useState } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { theme } from './theme';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import TransportControls from './components/TransportControls';
import PianoRoll from './components/PianoRoll';
import DrumGrid from './components/DrumGrid';
import AudioRecorder from './components/AudioRecorder';
import KeyboardSynth from './components/KeyboardSynth';

const GlobalStyle = createGlobalStyle`
  body {
    background: ${(props: any) => props.theme.background};
    color: ${(props: any) => props.theme.text};
    font-family: 'Segoe UI', sans-serif;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  @media (max-width: 768px) {
    flex-direction: column;
    min-height: 100vw;
    min-width: 100vh;
    transform: rotate(90deg);
    transform-origin: left top;
    width: 100vh;
    height: 100vw;
    overflow-x: scroll;
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${(props: any) => props.theme.white};
`;

export type Feature =
  | 'piano'
  | 'drums'
  | 'recorder'
  | 'synth'
  | 'importexport';

function App() {
  const [feature, setFeature] = useState<Feature>('piano');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Layout>
        <SidebarLeft active={feature} setFeature={setFeature} />
        <Main>
          <TransportControls
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
          {feature === 'piano' && <PianoRoll isPlaying={isPlaying} />}
          {feature === 'drums' && <DrumGrid isPlaying={isPlaying} />}
          {feature === 'recorder' && <AudioRecorder isPlaying={isPlaying} />}
          {feature === 'synth' && <KeyboardSynth isPlaying={isPlaying} />}
        </Main>
        <SidebarRight feature={feature} />
      </Layout>
    </ThemeProvider>
  );
}

export default App;