import * as posenet from '@tensorflow-models/posenet';
import {
    IMAGE_SCALE_FACTOR,
    FLIP_HORIZONTAL,
    OUTPUT_STRIDE,
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
    async apply(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {

        context.fillStyle = '#0000FF';

        const frameImageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const positions = await this.findEyesPosition(frameImageData);

        positions.forEach((position) => {

            const x = Math.round(position.position.x);
            const y = Math.round(position.position.y);

            const adjustedX = x;
            const adjustedY = y;

            context.font = '40px Arial';
            context.fillText('💋', adjustedX, adjustedY);
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
