import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { ICodeAPIService } from '@alipay/alex-code-service';
import { AntCodeService } from './antcode.service';

@Injectable()
export class AntCodeModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: ICodeAPIService,
      useClass: AntCodeService,
    },
  ];
}
