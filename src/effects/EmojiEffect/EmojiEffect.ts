import * as posenet from '@tensorflow-models/posenet';
import {
    IMAGE_SCALE_FACTOR,
    FLIP_HORIZONTAL,
    MIN_PART_CONFIDENCE,
    MAX_POSE_DETECTIONS,
    OUTPUT_STRIDE,
    NMS_RADIUS,
    RELEVANT_BODY_PARTS,
    MINIMUM_SCORE,
} from '../../consts';
// import ICameraEffect from '../ICameraEffect';

export default class EmojiEffect {

    private posenetModel: posenet.PoseNet  = null;

    async init() {
        this.posenetModel = await posenet.load();
    }

    // tslint:disable-next-line:max-line-length
    async apply(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, video: HTMLVideoElement) {

        context.fillStyle = '#FF0000';

        const positions = await this.findEyesPosition(video);

        positions.forEach((position) => {

            const x = Math.round(position.position.x);
            const y = Math.round(position.position.y);

            const adjustedX = x;
            const adjustedY = y;

            // const scale = Math.min(
            //     canvas.width / video.videoWidth,
            //     canvas.height / video.videoHeight,
            // );

            // const adjustedWidth = video.videoWidth * scale;
            // const adjustedHeight = video.videoHeight * scale;
            // const adjustedX = (canvas.width / 2) - (adjustedWidth / 2);
            // const adjustedY = (canvas.height / 2) - (adjustedHeight / 2);

            context.font = '40px Arial';
            context.fillText('💋', adjustedX, adjustedY);
        });

        // if (!firstPerson) return;

        // const x = Math.random() * 500 + 500;
        // const y = Math.random() * 500 + 500;

        // context.fillStyle = '#FF0000';
        // context.fillRect(100, 20, 300, 300);

        // context.font = '40px Arial';
        // context.fillText('💋', x, y);

        // const eyeIndex = y * frame.width + x;

        // frame.data[eyeIndex * 4 + 0] = 255;
        // frame.data[eyeIndex * 4 + 1] = 0;
        // frame.data[eyeIndex * 4 + 2] = 0;

        // // const l = frame.data.length / 4;
        // for (let i = 0; i < l; i += 1) {
        //     const r = frame.data[i * 4 + 0];
        //     const g = frame.data[i * 4 + 1];
        //     const b = frame.data[i * 4 + 2];
        //     if (g > 100 && r > 100 && b < 43) {
        //         frame.data[i * 4 + 3] = 0;
        //     }
        // }
    }

    private async findEyesPosition(videoElement: HTMLVideoElement) {

        const pose = await this.posenetModel.estimateSinglePose(
            videoElement,
            IMAGE_SCALE_FACTOR,
            FLIP_HORIZONTAL,
            OUTPUT_STRIDE,
        );

        const data = pose.keypoints.filter(
            point => RELEVANT_BODY_PARTS.includes(point.part) && point.score > MINIMUM_SCORE,
        );

        return data;
    }
}
