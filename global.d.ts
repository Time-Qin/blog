declare interface Window {
    documentPictureInPicture: {
        requestWindow: (options: { width?: number, height?: number }) => Promise<any>
    } & Document
}