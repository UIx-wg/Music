import React from 'react';
import styled from 'styled-components';
import type { Feature } from '../App';

const Sidebar = styled.aside`
  width: 70px;
  background: ${(props: any) => props.theme.sidebar};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  border-right: 1px solid ${(props: any) => props.theme.border};
`;

const Icon = styled.button<{active: boolean}>`
  background: ${({active, theme}) => active ? theme.accent : 'none'};
  border: none;
  margin: 12px 0;
  font-size: 1.6em;
  color: ${(props: any) => props.theme.text};
  cursor: pointer;
  border-radius: 50%;
  width: 48px; height: 48px;
`;

const items: {icon: string, label: string, feature: Feature}[] = [
  { icon: '🎹', label: 'Piano', feature: 'piano' },
  { icon: '🥁', label: 'Drums', feature: 'drums' },
  { icon: '🎤', label: 'Recorder', feature: 'recorder' },
  { icon: '🎛️', label: 'Synth', feature: 'synth' },
  { icon: '⬆️⬇️', label: 'Import/Export', feature: 'importexport' }
];

export default function SidebarLeft({
  active, setFeature
}: {active: Feature, setFeature: (f: Feature)=>void}) {
  return (
    <Sidebar>
      {items.map(i => (
        <Icon
          key={i.feature}
          active={active === i.feature}
          title={i.label}
          onClick={() => setFeature(i.feature)}
        >{i.icon}</Icon>
      ))}
    </Sidebar>
  );
}