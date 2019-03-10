import * as React from 'react';
import * as posenet from '@tensorflow-models/posenet';
import PoseFrameDetector from '../../modules/PoseFrameDetector';
import { RELEVANT_BODY_PARTS, MINIMUM_SCORE } from '../../consts';

interface State { bodyParts: posenet.Keypoint[]; }
interface Props { htmlVideoElement: HTMLVideoElement; }

class EmojiCanvas extends React.Component<Props, State> {

    state: Readonly<State> = {
        bodyParts: [],
    };

    componentDidMount() {
        const { htmlVideoElement } = this.props;
        PoseFrameDetector.startTrackingFrames(htmlVideoElement, this.updateEmojisPositions);
    }

    updateEmojisPositions = (poses: posenet.Pose[]) => {
        const bodyParts: posenet.Keypoint[] = [];

        poses.forEach((pose) => {
            const data = pose.keypoints.filter(
                point => RELEVANT_BODY_PARTS.includes(point.part) && point.score > MINIMUM_SCORE,
            );
            bodyParts.push(...data);
        });

        console.log(poses);

        this.setState({ bodyParts });
    }

    render() {
        return (
            <canvas id="emojis-canvas"></canvas>
        );
    }
}

export default EmojiCanvas;
