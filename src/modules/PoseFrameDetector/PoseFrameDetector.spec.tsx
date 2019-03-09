import { PoseFrameDetector } from './PoseFrameDetector';

jest.mock('@tensorflow-models/posenet', () => ({ }));

describe('Module: PoseFrameDetector', () => {

    describe('#constructor', () => {

        it('should load the posenet model', () => {
            PoseFrameDetector.startModel = jest.fn();
            const poseFrameDetector = new PoseFrameDetector();
            expect(poseFrameDetector.startModel).toHaveBeenCalledTimes(1);
        });

    });

});
