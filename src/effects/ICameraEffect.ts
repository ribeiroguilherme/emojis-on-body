export default interface ICameraEffect {
    init: () => Promise<void>;
    apply: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => Promise<void>;
}
