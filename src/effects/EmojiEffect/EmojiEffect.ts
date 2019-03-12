import * as posenet from '@tensorflow-models/posenet';
import ICameraEffect from '../ICameraEffect';
import {
    IMAGE_SCALE_FACTOR,
    FLIP_HORIZONTAL,
    OUTPUT_STRIDE,
    RELEVANT_BODY_PARTS,
    MINIMUM_SCORE,
} from '../../consts';

export default class EmojiEffect implements ICameraEffect {

    private posenetModel: posenet.PoseNet  = null;

    async init() {
        this.posenetModel = await posenet.load();
    }

    async apply(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {

        context.fillStyle = '#0000FF';

        const frameImageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const poses = await this.findEyesPosition(frameImageData);

        poses.forEach((pose) => {
            const { x, y } = pose.position;

            context.font = '40px Arial';
            context.fillText('👁', x, y);
        });

    }

    private async findEyesPosition(imageData: ImageData) {

        const pose = await this.posenetModel.estimateSinglePose(
            imageData,
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
