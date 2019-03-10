import * as React from 'react';
import Camera from '../components/Camera';
import CameraSwticher from '../components/CameraSwticher';
import EmojisCanvas from '../components/EmojisCanvas';
import ViewPortMeasurer from '../components/ViewPortMeasurer';
import { VIDEO_INPUT } from '../consts';
import './Main.css';

interface State {
    showVideoSwitcher: boolean;
    viewType: 'user' | 'environment';
    isCameraReady: boolean;
}

class Main extends React.Component<{}, State> {

    state: Readonly<State> = {
        showVideoSwitcher: false,
        viewType: 'environment',
        isCameraReady: false,
    };

    private cameraRef = React.createRef<Camera>();

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

    handleVideoStart = () =>
        this.setState({ isCameraReady: true })

    async verifyAvailableVideoDevices() {

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videosDevices = devices.filter(device => device.kind === VIDEO_INPUT);

        if (videosDevices.length > 1) {
            this.enableVideoSwitcher();
        }

    }

    render() {
        const { showVideoSwitcher, viewType, isCameraReady } = this.state;

        return (
            <div className="screen">
                <ViewPortMeasurer>
                    {
                        (height, width) => (
                            <Camera
                                ref={this.cameraRef}
                                viewType={viewType}
                                onVideoStarts={this.handleVideoStart}
                                width={width}
                                height={height}
                            />
                        )
                    }
                </ViewPortMeasurer>
{/*
                {
                    isCameraReady &&
                        <EmojisCanvas
                            htmlVideoElement={this.cameraRef.current.videoElement.current}
                        />
                }

                {
                    showVideoSwitcher &&
                        <CameraSwticher onSwitchCamera={this.handleSwitchCamera} />
                } */}
            </div>
        );
    }
}

export default Main;
