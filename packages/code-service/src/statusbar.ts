import { Autowired } from '@ali/common-di';
import { Event, IDisposable } from '@ali/ide-core-common';
import {
  IStatusBarService,
  Domain,
  ClientAppContribution,
  StatusBarAlignment,
  localize,
} from '@ali/ide-core-browser';
import { CodeModelService } from './code-model.service';

@Domain(ClientAppContribution)
export class StatusbarContribution implements ClientAppContribution {
  @Autowired(IStatusBarService)
  private readonly statusbarService: IStatusBarService;

  @Autowired()
  codeModel: CodeModelService;

  private disposables: IDisposable[] = [];

  initialize() {
    const getRefText = () =>
      this.codeModel.headLabel ? `$(git-branch) ${this.codeModel.headLabel}` : '';

    this.statusbarService.addElement('code-service', {
      text: getRefText(),
      tooltip: localize('code-service.checkout'),
      alignment: StatusBarAlignment.LEFT,
      priority: 0,
    });

    Event.any(this.codeModel.onDidChangeHEAD, this.codeModel.onDidChangeRefs)(
      () => {
        this.statusbarService.setElement('code-service', {
          text: getRefText(),
        });
      },
      null,
      this.disposables
    );
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
  }
}
