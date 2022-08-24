export class Mfile {
  constructor(file: Express.Multer.File | Mfile) {
    this.buffer = file.buffer;
    this.originalname = file.originalname;
  }
  originalname: string;
  buffer: Buffer;
}
