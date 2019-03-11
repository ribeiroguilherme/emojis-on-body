export default interface ICameraEffect {
    init(): Promise<void>;
    apply(frame: ImageData, video: HTMLVideoElement): Promise<void>;
}
