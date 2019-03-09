// tslint:disable-next-line:import-name
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import CameraButton from './CameraButton';

it('renders without crashing', () => {
  const div = document.createElement('div');
  render(<CameraButton />, div);
  unmountComponentAtNode(div);
});
