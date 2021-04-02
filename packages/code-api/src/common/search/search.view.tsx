import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ConfigContext, localize, getIcon } from '@ali/ide-core-browser';
import { ProgressBar } from '@ali/ide-core-browser/lib/components/progressbar';
import { ValidateInput } from '@ali/ide-components';
import { ViewState } from '@ali/ide-core-browser';
import * as cls from 'classnames';
import * as styles from '@ali/ide-search/lib/browser/search.module.less';
import { SEARCH_STATE } from '@ali/ide-search/lib/common';
import { ContentSearchClientService } from '@ali/ide-search/lib/browser/search.service';
import { SearchTree } from './search-tree.view';

export const Search = observer(
  ({ viewState }: React.PropsWithChildren<{ viewState: ViewState }>) => {
    const searchOptionRef = React.createRef<HTMLDivElement>();
    const configContext = React.useContext(ConfigContext);
    const { injector } = configContext;
    const searchBrowserService = injector.get(ContentSearchClientService);

    const [searchPanelLayout, setSearchPanelLayout] = React.useState({ height: 0, width: 0 });
    const searchTreeRef = React.useRef();

    const searchResults = searchBrowserService.searchResults;
    const resultTotal = searchBrowserService.resultTotal;
    const searchState = searchBrowserService.searchState;
    const doReplaceAll = searchBrowserService.doReplaceAll;
    const updateUIState = searchBrowserService.updateUIState;
    const UIState = searchBrowserService.UIState;
    const searchError = searchBrowserService.searchError;
    const isSearchDoing = searchBrowserService.isSearchDoing;
    const validateMessage = searchBrowserService.validateMessage;
    const isShowValidateMessage = searchBrowserService.isShowValidateMessage;

    React.useEffect(() => {
      setSearchPanelLayout({
        width: (searchOptionRef.current && searchOptionRef.current.clientWidth) || 0,
        height: (searchOptionRef.current && searchOptionRef.current.clientHeight) || 0,
      });
    }, [UIState, searchOptionRef.current, searchResults.size > 0]);

    const collapsePanelContainerStyle = {
      width: viewState.width || '100%',
      height: viewState.height,
    };

    return (
      <div className={styles.wrap} style={collapsePanelContainerStyle}>
        <div className={styles['loading-wrap']}>
          <ProgressBar loading={isSearchDoing} />
        </div>
        <div className={styles.search_options} ref={searchOptionRef}>
          <div className={styles.search_and_replace_container}>
            <div className={styles.search_and_replace_fields}>
              <div className={styles.search_field_container}>
                <p className={styles.search_input_title}>{localize('search.input.title')}</p>
                <div
                  className={cls(styles.search_field, { [styles.focus]: UIState.isSearchFocus })}
                >
                  <ValidateInput
                    id="search-input-field"
                    title={localize('search.input.placeholder')}
                    type="text"
                    value={searchBrowserService.searchValue}
                    placeholder={localize('search.input.placeholder')}
                    onFocus={() => updateUIState({ isSearchFocus: true })}
                    onBlur={() => updateUIState({ isSearchFocus: false })}
                    onKeyUp={searchBrowserService.search}
                    onChange={searchBrowserService.onSearchInputChange}
                    ref={searchBrowserService.searchInputEl}
                    validateMessage={isShowValidateMessage ? validateMessage : undefined}
                    addonAfter={[
                      <span
                        key={localize('caseDescription')}
                        className={cls(getIcon('ab'), styles['match-case'], styles.option, {
                          [styles.select]: UIState.isMatchCase,
                        })}
                        title={localize('caseDescription')}
                        onClick={(e) => updateUIState({ isMatchCase: !UIState.isMatchCase }, e)}
                      />,
                      <span
                        key={localize('wordsDescription')}
                        className={cls(getIcon('abl'), styles['whole-word'], styles.option, {
                          [styles.select]: UIState.isWholeWord,
                        })}
                        title={localize('wordsDescription')}
                        onClick={(e) => updateUIState({ isWholeWord: !UIState.isWholeWord }, e)}
                      />,
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {searchResults && searchResults.size > 0 && !searchError ? (
          <SearchTree
            searchPanelLayout={searchPanelLayout}
            viewState={viewState}
            ref={searchTreeRef}
          />
        ) : (
          <div
            className={cls(
              { [styles.result_describe]: searchState === SEARCH_STATE.done },
              { [styles.result_error]: searchState === SEARCH_STATE.error || searchError }
            )}
          >
            {searchState === SEARCH_STATE.done && !searchError
              ? localize('noResultsFound').replace('-', '')
              : ''}
            {searchError}
          </div>
        )}
      </div>
    );
  }
);
