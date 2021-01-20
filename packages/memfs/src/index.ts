import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { MemFSContribution } from './memfs.contribution';
import { MemFileTreeContribution } from './memfs-file-tree';

@Injectable()
export class MemFSModule extends BrowserModule {
  providers: Provider[] = [MemFSContribution, MemFileTreeContribution];
}
