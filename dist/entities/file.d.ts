/// <reference types="node" />
/// <reference types="node" />
export default class File {
    readonly buffer: Buffer;
    readonly name: string;
    readonly type: string;
    constructor(buffer: Buffer, name: string, type: string);
}
