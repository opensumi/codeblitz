import { Injectable } from '@opensumi/di';
import { ClientAppContribution, Domain } from '@opensumi/ide-core-browser';
import { ExtensionStorageService } from '@opensumi/ide-extension-storage/lib/browser/storage.service';
import { IExtensionStorageService } from '@opensumi/ide-extension-storage';

@Domain(ClientAppContribution)
@Injectable()
export class ExtensionStorageServiceOverride
    extends ExtensionStorageService
    implements IExtensionStorageService, ClientAppContribution {
    constructor() {
        super();
    }
    initialize() { }
}