import * as React from 'react';
import './Camera.css';

interface State {
    permissionGranted: boolean;
    isEffectInited: boolean;
}
interface Props {
    viewType: string;
    height: number;
    width: number;
    effect: any;
}

class Camera extends React.PureComponent<Props, State> {

    videoElement = React.createRef<HTMLVideoElement>();

    private canvasElement = React.createRef<HTMLCanvasElement>();

    private canvasContext: CanvasRenderingContext2D = null;

    private currentStream: MediaStream = null;

    private effect: any;

    state: Readonly<State> = {
        permissionGranted: null,
        isEffectInited: false,
    };

    componentDidMount() {
        this.canvasContext = this.canvasElement.current.getContext('2d');
        this.effect = new this.props.effect();
        this.effect.init().then(() => this.setState({ isEffectInited: true }))
        this.startCamera();
    }

    componentDidUpdate() {
        this.stopMediaTracks();
        this.startCamera();
    }

    syncVideoWithCanvas = () => {
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                this.captureVideoAndAdjust();
                this.applyEffect()
                    .then(() => this.syncVideoWithCanvas())
                    .then(resolve);
            });
        });
    }

    captureVideoAndAdjust() {
        const video = this.videoElement.current;
        const canvas = this.canvasElement.current;
        const scale = Math.min(
            canvas.width / video.videoWidth,
            canvas.height / video.videoHeight,
        );

        const adjustedWidth = video.videoWidth * scale;
        const adjustedHeight = video.videoHeight * scale;
        const adjustedLeft = (canvas.width / 2) - (adjustedWidth / 2);
        const adjustedTop = (canvas.height / 2) - (adjustedHeight / 2);

        this.canvasContext.drawImage(
            this.videoElement.current,
            adjustedLeft,
            adjustedTop,
            adjustedWidth,
            adjustedHeight,
        );
    }

    async applyEffect() {
        if (this.state.isEffectInited === false) return;
        const video = this.videoElement.current;
        const canvas = this.canvasElement.current;
        // const frame = this.canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        await this.effect.apply(this.canvasContext, canvas, video);

        // this.canvasContext.putImageData(frame, 0, 0);
    }

    async startCamera() {

        const stream = await this.requestMedia();

        if (!stream) return;

        this.currentStream = stream;

        this.videoElement.current.srcObject = stream;
        this.videoElement.current
            .play()
            .then(this.syncVideoWithCanvas);

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
