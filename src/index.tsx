import * as React from 'react';
import { render } from 'react-dom';
import Main from './page/Main';
import 'normalize.css';

render(
    <Main />,
    document.getElementsByTagName('main')[0],
);
