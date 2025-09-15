import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'imageUrl must be a valid URL' })
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  caption: string;
}
