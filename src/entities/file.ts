export default class File {
    public readonly buffer: Buffer;
    public readonly name: string;
    public readonly type: string;

    constructor(buffer: Buffer, name: string, type: string) {
        this.buffer = buffer;
        this.name = name;
        this.type = type;
    }
}