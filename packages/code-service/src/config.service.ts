import { RuntimeConfig } from '@codeblitzjs/ide-sumi-core';
import { Autowired, Injectable } from '@opensumi/di';

import { CodeModelService } from './code-model.service';

/**
 * 调整 runtimeConfig
 */
@Injectable()
export class Configure {
  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired()
  codeModel: CodeModelService;

  configTextSearch() {
    if (this.runtimeConfig.textSearch) return;

    this.runtimeConfig.textSearch = {
      config: {
        regexp: false,
        replace: false,
        caseSensitive: 'local',
        wordMatch: 'local',
        include: 'local',
        exclude: 'local',
      },
      provideResults: async (query, options, progress) => {
        const requestResults = await this.codeModel.rootRepository.request.searchContent(
          query.pattern,
          {
            limit: options.maxResults,
          },
        );
        if (!requestResults.length) return;
        const searchString = query.pattern.toLowerCase();
        const searchStringLen = searchString.length;
        requestResults.forEach(({ path, line, content }) => {
          const text = content.toLowerCase();

          let lastMatchIndex = -searchStringLen;
          const matches: [number, number][] = [];
          while (
            (lastMatchIndex = text.indexOf(searchString, lastMatchIndex + searchStringLen)) !== -1
          ) {
            matches.push([lastMatchIndex, lastMatchIndex + searchStringLen]);
          }
          if (matches.length) {
            progress.report({
              path,
              lineNumber: line,
              preview: {
                text: content,
                matches,
              },
            });
          }
        });
      },
    };
  }

  configFileSearch() {
    if (this.runtimeConfig.fileSearch) return;

    this.runtimeConfig.fileSearch = {
      config: {
        include: 'local',
        exclude: 'local',
      },
      provideResults: (query, options) => {
        return this.codeModel.rootRepository.request.searchFile(query.pattern, {
          limit: options.maxResults,
        });
      },
    };
  }
}
