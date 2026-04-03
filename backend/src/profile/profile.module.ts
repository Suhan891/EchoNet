import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { CommonModule } from 'src/common/common.module';
import { ProfileGaurd } from './gaurds/profile.gaurd';

@Module({
  imports: [CommonModule],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileGaurd],
  exports: [ProfileService, ProfileGaurd],
})
export class ProfileModule {}
