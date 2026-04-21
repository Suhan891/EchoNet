import { BadRequestException, Injectable } from '@nestjs/common';
import { ParsedSlideDto, RawMultipartBody } from '../dto/story.create.dto';

type SlideMap = Record<number, Partial<ParsedSlideDto>>;

@Injectable()
export class ParsedStoryPipe {
  transform(
    files: Express.Multer.File[],
    body: RawMultipartBody,
  ): ParsedSlideDto[] {
    const parseBody = this.parseBody(body);
    const parsedFile = this.parseFile(files);

    const slide = this.merge(parseBody, parsedFile);
    console.log('File data after merging: \n', slide);

    this.validateSlide(slide);

    return slide;
  }

  private parseBody(body: RawMultipartBody): SlideMap {
    const result: SlideMap = {};
    if (!body.slides || !Array.isArray(body.slides)) return result;

    body.slides.forEach((slide, index) => {
      result[index] = {
        type: slide.type,
        caption: slide.caption,
      };
    });

    return result;
  }

  private parseFile(files: Express.Multer.File[]): SlideMap {
    const result: SlideMap = {};

    files.forEach((file) => {
      const match = file.fieldname.match(/slides\[(\d+)\]\[(.+)\]/);
      if (!match) return;

      const index = Number(match[1]);
      const field = match[2] as keyof ParsedSlideDto;

      if (!result[index]) result[index] = {};

      if (field === 'imageFile') result[index].imageFile = file;
      if (field === 'videoFile') result[index].videoFile = file;
      if (field === 'audioFile') result[index].audioFile = file;
    });
    return result;
  }

  private merge(bodyMap: SlideMap, fileMap: SlideMap): ParsedSlideDto[] {
    const indexes = new Set([
      ...Object.keys(bodyMap).map(Number),
      ...Object.keys(fileMap).map(Number),
    ]);

    return Array.from(indexes)
      .map((index) => ({
        ...bodyMap[index],
        ...fileMap[index],
        order: index + 1,
      }))
      .sort((a, b) => a.order - b.order) as ParsedSlideDto[];
  }

  private validateSlide(slides: ParsedSlideDto[]) {
    slides.forEach((slide, i) => {
      if (!slide.type)
        throw new BadRequestException(`File type of order ${i + 1} is needed`);

      if (slide.type === 'image') {
        if (!slide.imageFile)
          throw new BadRequestException(`Image of order ${i + 1} is needed`);
        this.validateFile('image', slide.imageFile, i);
      }
      if (slide.type === 'video') {
        if (!slide.videoFile)
          throw new BadRequestException(`Video of order ${i + 1} is needed`);
        this.validateFile('video', slide.videoFile, i);
      }

      if (slide.type === 'imageAudio') {
        if (!slide.imageFile || !slide.audioFile)
          throw new BadRequestException(
            `Image and audio of order ${i + 1} is needed`,
          );
        this.validateFile('image', slide.imageFile, i);
        this.validateFile('audio', slide.audioFile, i);
      }
    });
  }

  private validateFile(
    type: 'image' | 'video' | 'audio',
    file: Express.Multer.File,
    index: number,
  ) {
    const allowed = {
      image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      video: ['video/mp4', 'video/webm', 'video/quicktime'],
      audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    };
    const max = {
      image: 10 * 1024 * 1024,
      video: 100 * 1024 * 1024,
      audio: 20 * 1024 * 1024,
    };

    if (!allowed[type].includes(file.mimetype))
      throw new BadRequestException(`Slide ${index}: invalid ${type}`);

    if (max[type] < file.size)
      throw new BadRequestException(`Slide ${index}: ${type} too large`);
  }
}
