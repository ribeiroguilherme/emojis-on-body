import * as React from 'react';
import './Camera.css';

interface State { permissionGranted: boolean; }
interface Props {
    viewType: string;
    onVideoStarts: Function;
    height: number;
    width: number;
}

class Camera extends React.PureComponent<Props, State> {

    videoElement = React.createRef<HTMLVideoElement>();

    private canvasElement = React.createRef<HTMLCanvasElement>();

    private canvasContext: CanvasRenderingContext2D = null;

    private currentStream: MediaStream = null;

    state: Readonly<State> = {
        permissionGranted: null,
    };

    componentDidMount() {
        this.canvasContext = this.canvasElement.current.getContext('2d');
        this.startCamera();
    }

    componentDidUpdate() {
        this.stopMediaTracks();
        this.startCamera();
    }

    syncVideoWithCanvas = () => {
        if (this.videoElement.current.paused || this.videoElement.current.ended) {
            return;
        }

        this.computeFrame();

        setTimeout(() => this.syncVideoWithCanvas(), 0);
    }

    computeFrame() {
        const video = this.videoElement.current;
        const canvas = this.canvasElement.current;
        const { videoWidth, videoHeight } = this.videoElement.current;
        const scale = Math.min(
            canvas.width / video.videoWidth,
            canvas.height / video.videoHeight,
        );

        const adjustedWidth = video.videoWidth * scale;
        const adjustedHeight = video.videoHeight * scale;
        const adjustedTop = (canvas.height / 2) - (adjustedHeight / 2);
        const adjustedLeft = (canvas.width / 2) - (adjustedWidth / 2);

        this.canvasContext.drawImage(
            this.videoElement.current,
            adjustedLeft,
            adjustedTop,
            adjustedWidth,
            adjustedHeight,
        );

        const frame = this.canvasContext.getImageData(0, 0, videoWidth, videoHeight);
        const l = frame.data.length / 4;

        for (let i = 0; i < l; i += 1) {
            const r = frame.data[i * 4 + 0];
            const g = frame.data[i * 4 + 1];
            const b = frame.data[i * 4 + 2];
            if (g > 100 && r > 100 && b < 43) {
                frame.data[i * 4 + 3] = 0;
            }
        }
        this.canvasContext.putImageData(frame, 0, 0);
    }

    async startCamera() {

        const stream = await this.requestMedia();

        if (!stream) return;

        this.currentStream = stream;

        this.videoElement.current.srcObject = stream;
        this.videoElement.current.play().then(() => {
            this.syncVideoWithCanvas();
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
        const { height, width } = this.props;

        if (permissionGranted === false) {
            return (
                <div className="camera__message">Please grant access to the camera</div>
            );
        }

        return (
            <React.Fragment>
                <video
                    ref={this.videoElement}
                    height={height}
                    width={width}
                    playsInline
                    autoPlay
                    className="camera__video"
                />
                <canvas
                    ref={this.canvasElement}
                    height={height}
                    width={width}
                />

            </React.Fragment>
        );
    }

}

export default Camera;
