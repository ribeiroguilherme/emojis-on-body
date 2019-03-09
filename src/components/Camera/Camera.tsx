import * as React from 'react';
import './Camera.css';

interface State { permissionGranted: boolean; }
interface Props {
    viewType: string;
    onVideoStarts: Function;
}

class Camera extends React.PureComponent<Props, State> {

    videoElement = React.createRef<HTMLVideoElement>();

    private currentStream: MediaStream = null;

    state: Readonly<State> = {
        permissionGranted: null,
    };

    componentDidMount() {
        this.startCamera();
    }

    componentDidUpdate() {
        this.stopMediaTracks();
        this.startCamera();
    }

    async startCamera() {

        const stream = await this.requestMedia();

        if (!stream) return;

        this.currentStream = stream;

        this.videoElement.current.srcObject = stream;
        this.videoElement.current.play().then(() => {
            this.props.onVideoStarts();
        });

    }

    async requestMedia() {

        const constraint = {
            video: { facingMode: this.props.viewType },
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraint);
            return stream;
        } catch (error) {
            this.setState({ permissionGranted: false });
            return null;
        }
    }

    stopMediaTracks() {
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(track => track.stop());
        }
    }

    render() {
        const { permissionGranted } = this.state;

        return (
            <div className="camera">

                <video
                    ref={this.videoElement}
                    height={300}
                    width={300}
                />

                {
                    permissionGranted === false &&
                        <div className="camera__message">Please grant access to the camera</div>
                }
            </div>
        );
    }

}

export default Camera;
