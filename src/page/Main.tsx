import * as React from 'react';
import Camera from '../components/Camera';
import CameraSwticher from '../components/CameraSwticher';
import ViewPortMeasurer from '../components/ViewPortMeasurer';
import EmojiEffect from '../effects/EmojiEffect';
import { VIDEO_INPUT } from '../consts';
import './Main.css';

interface State {
    showVideoSwitcher: boolean;
    viewType: 'user' | 'environment';
}

class Main extends React.Component<{}, State> {

    state: Readonly<State> = {
        showVideoSwitcher: false,
        viewType: 'environment',
    };

    componentDidMount() {
        this.verifyAvailableVideoDevices();
    }

    enableVideoSwitcher() {
        this.setState({ showVideoSwitcher: true });
    }

    handleSwitchCamera = () => {
        const { viewType } = this.state;

        if (viewType === 'user') {
            this.setState({ viewType: 'environment' });
        } else {
            this.setState({ viewType: 'user' });
        }
    }

    async verifyAvailableVideoDevices() {

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videosDevices = devices.filter(device => device.kind === VIDEO_INPUT);

        if (videosDevices.length > 1) {
            this.enableVideoSwitcher();
        }

    }

    render() {
        const { showVideoSwitcher, viewType } = this.state;

        return (
            <div className="screen">
                <ViewPortMeasurer>
                    {
                        (height, width) => (
                            <React.Fragment>
                                <Camera
                                    viewType={viewType}
                                    width={width}
                                    height={height}
                                    effect={EmojiEffect}
                                />

                                {
                                    showVideoSwitcher &&
                                        <CameraSwticher onSwitchCamera={this.handleSwitchCamera} />
                                }

                            </React.Fragment>
                        )
                    }
                </ViewPortMeasurer>

            </div>
        );
    }
}

export default Main;
