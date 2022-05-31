import * as React from 'react';
import { useInjectable } from '@opensumi/ide-core-browser/lib/react-hooks';
import { observer } from 'mobx-react-lite';
import { ViewState, localize } from '@opensumi/ide-core-browser';
import {
  RecycleTree,
  RecycleTreeFilterDecorator,
  IRecycleTreeHandle,
  INodeRendererWrapProps,
  TreeNodeType,
  TreeModel,
} from '@opensumi/ide-components';

import { ChangeFile, ChangeDirectory } from './changes-tree-node';
import { ChangesTreeModelService } from './changes-tree-model.service';
import { ChangeTreeNode } from './changes-tree-node.view';

import * as styles from './index.module.less';

export const TREE_FIELD_NAME = 'CHANGES_TREE_TREE_FIELD';

const FilterableRecycleTree = RecycleTreeFilterDecorator(RecycleTree);

export const ChangesTreeView = observer(
  ({ viewState }: React.PropsWithChildren<{ viewState: ViewState }>) => {
    const OPEN_EDITOR_NODE_HEIGHT = 22;
    const [isReady, setIsReady] = React.useState<boolean>(false);
    const [model, setModel] = React.useState<TreeModel>();

    const { width, height } = viewState;

    const wrapperRef: React.RefObject<HTMLDivElement> = React.createRef();

    const changesTreeModelService = useInjectable<ChangesTreeModelService>(ChangesTreeModelService);
    const { decorationService, labelService, commandService, indent, baseIndent } =
      changesTreeModelService;

    const handleTreeReady = (handle: IRecycleTreeHandle) => {
      changesTreeModelService.handleTreeHandler({
        ...handle,
        getModel: () => changesTreeModelService.treeModel,
        hasDirectFocus: () => wrapperRef.current === document.activeElement,
      });
    };

    const handleItemClicked = (
      ev: React.MouseEvent,
      item: ChangeFile | ChangeDirectory,
      type: TreeNodeType
    ) => {
      // 阻止点击事件冒泡
      ev.stopPropagation();

      const { handleItemClick } = changesTreeModelService;
      if (!item) {
        return;
      }
      handleItemClick(item, type);
    };

    const ensureIsReady = async () => {
      await changesTreeModelService.whenReady;
      if (changesTreeModelService.treeModel) {
        // 确保数据初始化完毕，减少初始化数据过程中多次刷新视图
        // 这里需要重新取一下treeModel的值确保为最新的TreeModel
        await changesTreeModelService.treeModel.root.ensureLoaded();
      }
      setIsReady(true);
    };

    React.useEffect(() => {
      if (isReady) {
        setModel(changesTreeModelService.treeModel);
        changesTreeModelService.onDidTreeModelChange(async (model) => {
          await changesTreeModelService.whenReady;
          if (model) {
            // 确保数据初始化完毕，减少初始化数据过程中多次刷新视图
            await changesTreeModelService.treeModel.root.ensureLoaded();
          }
          setModel(model);
        });
      }
    }, [isReady]);

    React.useEffect(() => {
      ensureIsReady();
      return () => {
        changesTreeModelService.removeFileDecoration();
      };
    }, []);

    const renderContent = () => {
      if (!isReady) {
        return (
          <span className={styles.changes_tree_empty_text}>{localize('opened.editors.empty')}</span>
        );
      } else if (model) {
        return (
          <FilterableRecycleTree
            height={height}
            width={width}
            itemHeight={OPEN_EDITOR_NODE_HEIGHT}
            onReady={handleTreeReady}
            model={model}
            filterAutoFocus={false}
            filterEnabled
          >
            {(props: INodeRendererWrapProps) => (
              <ChangeTreeNode
                item={props.item}
                itemType={props.itemType}
                decorationService={decorationService}
                labelService={labelService}
                commandService={commandService}
                decorations={changesTreeModelService.decorations.getDecorations(props.item as any)}
                onClick={handleItemClicked}
                defaultLeftPadding={baseIndent}
                leftPadding={indent}
              />
            )}
          </FilterableRecycleTree>
        );
      }
    };

    return (
      <div
        className={styles.changes_tree_container}
        tabIndex={-1}
        ref={wrapperRef}
        data-name={TREE_FIELD_NAME}
      >
        {renderContent()}
      </div>
    );
  }
);
