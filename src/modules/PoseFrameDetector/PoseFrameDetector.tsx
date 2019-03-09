import * as posenet from '@tensorflow-models/posenet';
import {
    IMAGE_SCALE_FACTOR,
    FLIP_HORIZONTAL,
    MIN_PART_CONFIDENCE,
    MAX_POSE_DETECTIONS,
    OUTPUT_STRIDE,
    NMS_RADIUS,
} from '../../consts';

interface IPoseFrameDetector {
    startModel() : void;
    startTrackingFrames(videoElement: HTMLVideoElement, callback: Function) : void;
}

class PoseFrameDetector implements IPoseFrameDetector {

    private posenetModel: posenet.PoseNet  = null;

    private isModelInitialized = false;

    constructor() {
        this.startModel();
    }

    async startModel() {
        this.posenetModel = await posenet.load();
        this.isModelInitialized = true;
    }

    startTrackingFrames(videoElement: HTMLVideoElement, callback: Function) {

        const poseFrameDetection = async () =>  {

            const poses = await this.posenetModel.estimateMultiplePoses(
                videoElement,
                IMAGE_SCALE_FACTOR,
                FLIP_HORIZONTAL,
                OUTPUT_STRIDE,
                MAX_POSE_DETECTIONS,
                MIN_PART_CONFIDENCE,
                NMS_RADIUS,
            );

            callback(poses);
            requestAnimationFrame(poseFrameDetection);
        };

        if (!this.isModelInitialized) {
            setTimeout(() => {
                this.startTrackingFrames(videoElement, callback);
            // tslint:disable-next-line:align
            }, 500);
        } else {
            poseFrameDetection();
        }

    }

}

export { PoseFrameDetector };
export default new PoseFrameDetector();
