import * as React from 'react';
import ICameraEffect from '../../effects/ICameraEffect';
import ICameraStatus from './ICameraStatus';
import './Camera.css';

interface State {
    permissionGranted: boolean;
    isEffectInitialized: boolean;
    isCameraInitialized: boolean;
}
interface Props {
    viewType: string;
    height: number;
    width: number;
    effect: any; // !!
    onStatusChange: (cameraStatus: ICameraStatus) => void;
}

class Camera extends React.Component<Props, State> {

    private videoElement = React.createRef<HTMLVideoElement>();

    private canvasElement = React.createRef<HTMLCanvasElement>();

    private canvasContext: CanvasRenderingContext2D = null;

    private currentStream: MediaStream = null;

    private effect: ICameraEffect;

    state: Readonly<State> = {
        permissionGranted: null,
        isEffectInitialized: false,
        isCameraInitialized: false,
    };

    componentDidMount() {
        this.canvasContext = this.canvasElement.current.getContext('2d');
        this.effect = new this.props.effect();
        this.effect.init().then(() => {
            this.setState({ isEffectInitialized: true });
        });

        this.startCamera();
    }

    componentDidUpdate(prevProps: Props) {

        const shouldChangeCamera = prevProps.viewType !== this.props.viewType;

        if (shouldChangeCamera) {
            this.stopMediaTracks();
            this.startCamera();
        }

        if (!this.state.isCameraInitialized || shouldChangeCamera) {
            this.startCamera();
        }
    }

    syncVideoWithCanvas = () => {
        this.captureVideoAndAdjust();
        this.applyEffect()
            .then(() => {
                setTimeout(() => this.syncVideoWithCanvas(), 0);
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

        this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        this.canvasContext.drawImage(
            this.videoElement.current,
            adjustedLeft,
            adjustedTop,
            adjustedWidth,
            adjustedHeight,
        );
    }

    async applyEffect() {

        if (this.state.isEffectInitialized === false) return;

        const canvas = this.canvasElement.current;
        return await this.effect.apply(this.canvasContext, canvas);
    }

    async startCamera() {

        const stream = await this.requestMedia();

        if (!stream) return;

        this.currentStream = stream;

        this.setState({
            isCameraInitialized: true,
            permissionGranted: true,
        // tslint:disable-next-line:align
        }, () => {
            this.props.onStatusChange({ isCameraReady: true });

            this.videoElement.current.srcObject = stream;
            this.videoElement.current
                .play()
                .then(this.syncVideoWithCanvas);

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
        const { permissionGranted, isEffectInitialized } = this.state;
        const { height, width } = this.props;

        return (
            <React.Fragment>

                {
                    permissionGranted === false &&
                        <div className="camera__message">
                            Please grant access to the camera
                        </div>
                }

                {
                    (permissionGranted && !isEffectInitialized) &&
                        <div className="camera__message">
                            Initializing effect..
                        </div>
                }
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
