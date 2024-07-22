import { Autowired, Injectable } from '@opensumi/di';
import { path, replaceLocalizePlaceholder, URI } from '@opensumi/ide-core-browser';
import { StaticResourceService } from '@opensumi/ide-core-browser/lib/static-resource/static.definition';
import { EditorPreferences, WorkbenchEditorService } from '@opensumi/ide-editor/lib/browser';
import { AbstractExtInstanceManagementService } from '@opensumi/ide-extension/lib/browser/types';
import { AbstractExtensionManagementService, IExtensionProps } from '@opensumi/ide-extension/lib/common';
import { action, computed, observable, runInAction } from 'mobx';

import { EXT_SCHEME } from '../../common/constant';
import { DEFAULT_ICON_URL, ExtensionDetail, IExtension, OpenExtensionOptions, RawExtension } from './base';

const { posix } = path;

@Injectable()
export class ExtensionManagerService {
  @Autowired(AbstractExtInstanceManagementService)
  private readonly extInstanceManagementService: AbstractExtInstanceManagementService;

  @Autowired(AbstractExtensionManagementService)
  private readonly extManagementService: AbstractExtensionManagementService;

  @Autowired()
  protected staticResourceService: StaticResourceService;

  @Autowired(EditorPreferences)
  editorPreferences: EditorPreferences;

  @Autowired(WorkbenchEditorService)
  workbenchEditorService: WorkbenchEditorService;

  @observable
  isInit: boolean = false;

  @observable
  extensions: IExtension[] = [];

  @action
  async init() {
    if (this.isInit) {
      return;
    }
    const extensionProps = this.extInstanceManagementService
      .getExtensionInstances()
      .map((extension) => extension.toJSON());
    const extensions = await this.transformFromExtensionProp(extensionProps);
    // 是否要展示内置插件
    runInAction(() => {
      this.extensions = extensions;
      this.isInit = true;
    });
  }

  /**
   * 转换 IExtensionProps 到 IExtension
   * @param extensionProps
   */
  private async transformFromExtensionProp(
    extensionProps: IExtensionProps[],
  ): Promise<IExtension[]>;
  private async transformFromExtensionProp(extensionProps: IExtensionProps): Promise<IExtension>;
  private async transformFromExtensionProp(
    extensionProps: IExtensionProps[] | IExtensionProps,
  ): Promise<IExtension[] | IExtension> {
    if (Array.isArray(extensionProps)) {
      return await Promise.all(
        extensionProps.map(async (extension) => {
          return {
            ...extension,
            installed: true,
          };
        }),
      );
    }
    return {
      ...extensionProps,
      installed: true,
    };
  }

  @computed
  get rawExtension() {
    return this.extensions.map((extension) => {
      const { displayName, description } = this.getI18nInfo(extension);
      const [publisher, name] = extension.extensionId.split('.');
      return {
        id: extension.id,
        extensionId: extension.extensionId,
        // 说明加载的是新规范的插件，则用插件市场 name packageJSON 的 name
        name: name ? name : extension.packageJSON.name,
        displayName,
        version: extension.packageJSON.version,
        description,
        publisher: name ? publisher : extension.packageJSON.publisher,
        installed: extension.installed,
        icon: this.getIconFromExtension(extension),
        path: extension.realPath,
        enable: extension.isUseEnable,
        isBuiltin: true,
        isDevelopment: !extension.realPath.startsWith(`${EXT_SCHEME}:`),
        engines: {
          vscode: extension.packageJSON.engines?.vscode,
          opensumi: extension.packageJSON.engines?.opensumi,
        },
      };
    });
  }

  getRawExtensionById(extensionId: string): RawExtension | undefined {
    return this.rawExtension.find((extension) => this.equalExtensionId(extension, extensionId));
  }

  private equalExtensionId(extension: RawExtension, extensionId: string): boolean {
    return extension.extensionId === extensionId || extension.id === extensionId;
  }

  /**
   * 插件部分信息是 i18n 的，需要做层转换
   * @param extension
   */
  private getI18nInfo(extension: IExtension): { description: string; displayName: string } {
    let displayName;
    let description;

    displayName = replaceLocalizePlaceholder(extension.packageJSON.displayName, extension.id)
      || (extension.packageNlsJSON && extension.packageNlsJSON.displayName)
      || (extension.defaultPkgNlsJSON && extension.defaultPkgNlsJSON.displayName)
      || extension.packageJSON.displayName;
    description = replaceLocalizePlaceholder(extension.packageJSON.description, extension.id)
      || (extension.packageNlsJSON && extension.packageNlsJSON.description)
      || (extension.defaultPkgNlsJSON && extension.defaultPkgNlsJSON.description)
      || extension.packageJSON.description;

    return {
      description,
      displayName,
    };
  }

  private getIconFromExtension(extension: IExtension): string {
    const { icon } = extension.packageJSON;
    if (!icon) return DEFAULT_ICON_URL;
    const uri = new URI(extension.realPath);
    return this.staticResourceService
      .resolveStaticResource(uri.withPath(posix.join(uri.codeUri.path, icon)))
      .toString();
  }

  async getDetailById(extensionId: string): Promise<ExtensionDetail | undefined> {
    const extension = this.getRawExtensionById(extensionId);
    if (!extension) {
      return;
    }
    const extensionDetail = await this.extManagementService.getExtensionProps(extension.path, {
      readme: './README.md',
      changelog: './CHANGELOG.md',
    });
    if (extensionDetail) {
      return {
        ...extension,
        readme: extensionDetail.extraMetadata.readme,
        changelog: extensionDetail.extraMetadata.changelog,
        packageJSON: extensionDetail?.packageJSON,
        license: '',
        categories: '',
        repository: extensionDetail.packageJSON.repository
          ? extensionDetail.packageJSON.repository.url
          : '',
        contributes: extensionDetail?.packageJSON?.contributes,
        isDevelopment: extensionDetail.isDevelopment,
      };
    }
  }

  openExtensionDetail(options: OpenExtensionOptions) {
    const query = `extensionId=${options.publisher}.${options.name}&version=${options.version}&name=${
      options.displayName || options.name
    }&icon=${options.icon}`;
    // 当打开模式为双击同时预览模式生效时，默认单击为预览
    const editorOptions = {
      preview: this.editorPreferences['editor.previewMode'] && options.preview,
    };
    this.workbenchEditorService.open(new URI(`extension://local?${query}`), editorOptions);
  }
}
