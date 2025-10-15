import React from 'react';
import styled from 'styled-components';
import type { Feature } from '../App';

const Sidebar = styled.aside`
  width: 270px;
  background: ${(props: any) => props.theme.silver};
  padding: 16px;
  border-left: 1px solid ${(props: any) => props.theme.border};
  overflow-y: auto;
`;

export default function SidebarRight({ feature }: { feature: Feature }) {
  return (
    <Sidebar>
      <h3>
        {feature === 'piano' && 'MIDI Piano Editor'}
        {feature === 'drums' && 'Drum Sequencer'}
        {feature === 'recorder' && 'Audio Recorder'}
        {feature === 'synth' && 'Keyboard Synth'}
        {feature === 'importexport' && 'Import/Export'}
      </h3>
      {/* You can add feature-specific content here */}
      <p>Feature panel for {feature}</p>
    </Sidebar>
  );
}