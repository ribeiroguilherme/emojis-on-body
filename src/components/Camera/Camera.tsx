import * as React from 'react';
import ICameraEffect from '../../effects/ICameraEffect';
import ICameraStatus from './ICameraStatus';
import Message from '../Message';
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
            /**
             * In case the camera changed, all available tracks are stopped, and after
             * 1 second, the camera gets started again pointing to the desired direction
             *
             * Some delay is added, otherwise the user can get `NotReadableError`, meaning that
             * the device is already in use. Still improvements to be done, since this error still
             * poping up sometimes.
             */
            this.stopMediaTracks();
            setTimeout(() => {
                this.startCamera();
            // tslint:disable-next-line:align
            }, 1000);
            return;
        }

        if (!this.state.isCameraInitialized && this.state.permissionGranted) {
            this.startCamera();
        }
    }

    /**
     * Store the image in the canvas, and apply on it the effect.
     */
    syncVideoWithCanvas = () => {
        this.captureVideoAndAdjust();
        this.applyEffect()
            .then(() => {
                setTimeout(() => this.syncVideoWithCanvas(), 0);
            });
    }

    /**
     * As the video isn't full screen, this method captures its size and create a canvas
     * element with the same dimensions as the video has.
     */
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

    /**
     * Once the effect object is ready to be used, it starts to apply the  it
     * visual effects on the canvas element
     */
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

            if (error.name === 'NotAllowedError') {
                this.setState({ permissionGranted: false });
            }
            if (error.name === 'NotReadableError') {
                alert('Device not started: Seems like it is already in use');
            }
            return null;
        }
    }

    /**
     * Method that stops any stream in case if there is one already.
     * It is used when the user switch cameras
     */
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
                        <Message>Please grant access to the camera</Message>
                }

                {
                    (permissionGranted && !isEffectInitialized) &&
                        <Message>Initializing effect..</Message>
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
