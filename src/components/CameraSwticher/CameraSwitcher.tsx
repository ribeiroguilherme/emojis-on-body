import * as React from 'react';
import './CameraSwitcher.css';

const IMAGE_HEIGHT = '50px';

interface Props { onSwitchCamera(): void; }

// tslint:disable-next-line:variable-name
const CameraSwitcher: React.SFC<Props> = props => (
    <button
        onClick={props.onSwitchCamera}
        className="camera-switcher camera-switcher__button "
    >
        <img height={IMAGE_HEIGHT} src="./images/video-switcher.png" />
    </button>
);

export default CameraSwitcher;
