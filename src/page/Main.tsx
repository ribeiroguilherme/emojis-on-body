import * as React from 'react';
import Camera from '../components/Camera';
import CameraSwticher from '../components/CameraSwticher';
import ICameraStatus from '../components/Camera/ICameraStatus';
import ViewPortMeasurer from '../components/ViewPortMeasurer';
import EmojiEffect from '../effects/EmojiEffect';
import { VIDEO_INPUT } from '../consts';
import './Main.css';

interface State {
    hasMultipleCameras: boolean;
    viewType: 'user' | 'environment';
    isCameraReady: boolean;
}

class Main extends React.Component<{}, State> {

    state: Readonly<State> = {
        isCameraReady: false,
        hasMultipleCameras: false,
        viewType: 'user',
    };

    componentDidMount() {
        this.verifyAvailableVideoDevices();
    }

    enableVideoSwitcher() {
        this.setState({ hasMultipleCameras: true });
    }

    handleSwitchCamera = () => {
        const { viewType } = this.state;

        if (viewType === 'user') {
            this.setState({ viewType: 'environment' });
        } else {
            this.setState({ viewType: 'user' });
        }
    }

    handleStatusChange = ({ isCameraReady } : ICameraStatus) => {
        this.setState({ isCameraReady });
    }

    async verifyAvailableVideoDevices() {

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videosDevices = devices.filter(device => device.kind === VIDEO_INPUT);

        if (videosDevices.length > 1) {
            this.enableVideoSwitcher();
        }

    }

    render() {
        const { isCameraReady, hasMultipleCameras, viewType } = this.state;

        return (
            <React.Fragment>

                <ViewPortMeasurer>
                    {
                        (height, width) => (
                            <React.Fragment>
                                <Camera
                                    viewType={viewType}
                                    width={width}
                                    height={height}
                                    effect={EmojiEffect}
                                    onStatusChange={this.handleStatusChange}
                                />

                                {
                                    (isCameraReady) &&
                                        <CameraSwticher onSwitchCamera={this.handleSwitchCamera} />
                                }

                            </React.Fragment>
                        )
                    }
                </ViewPortMeasurer>

            </React.Fragment>
        );
    }
}

export default Main;
