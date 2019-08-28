//primary use is to provide an object
//that serves the called service callback emitter
export interface CallbackEmitterModel {
        err: boolean;
        errMsg: string;
        isWorking: boolean;
        outsideIndex: number;
        insideIndex: number;
    }
