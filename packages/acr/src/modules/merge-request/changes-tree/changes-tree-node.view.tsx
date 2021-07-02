import * as React from 'react';
import cls from 'classnames';
import {
  TreeNode,
  CompositeTreeNode,
  INodeRendererProps,
  ClasslistComposite,
  TreeNodeType,
} from '@ali/ide-components';
import { LabelService } from '@ali/ide-core-browser/lib/services';
import { URI, getIcon, CommandService } from '@ali/ide-core-browser';
import { Loading } from '@ali/ide-core-browser/lib/components/loading';
import { Icon } from '@ali/ide-core-browser/lib/components';

import { ChangeDirectory, ChangeFile } from './changes-tree-node';
import { ChangesTreeDecorationService } from './changes-tree-decoration.service';

import * as styles from './changes-tree-node.module.less';
import { ChangeBadge } from './components/changes-badge';
import { CommentReadBadge } from './components/comment-read-status';

export interface IEditorNodeProps {
  item: any;
  defaultLeftPadding?: number;
  leftPadding?: number;
  decorationService: ChangesTreeDecorationService;
  commandService: CommandService;
  labelService: LabelService;
  decorations?: ClasslistComposite;
  onClick: (
    ev: React.MouseEvent,
    item: TreeNode | CompositeTreeNode,
    type: TreeNodeType,
    activeUri?: URI
  ) => void;
  onTwistierClick?: (
    ev: React.MouseEvent,
    item: TreeNode | CompositeTreeNode,
    type: TreeNodeType,
    activeUri?: URI
  ) => void;
}

export type EditorNodeRenderedProps = IEditorNodeProps & INodeRendererProps;

export const ChangeTreeNode: React.FC<EditorNodeRenderedProps> = ({
  item,
  defaultLeftPadding = 8,
  leftPadding = 8,
  onClick,
  itemType,
  decorationService,
  labelService,
  decorations,
  onTwistierClick,
}: EditorNodeRenderedProps) => {
  const decoration = ChangeDirectory.is(item)
    ? null
    : decorationService.getDecoration(item.uri, false);

  const handleClick = (ev: React.MouseEvent) => {
    if (itemType === TreeNodeType.TreeNode || itemType === TreeNodeType.CompositeTreeNode) {
      onClick(ev, item as ChangeFile, itemType);
    }
  };

  const paddingLeft =
    defaultLeftPadding +
    (item.depth || 0) * (leftPadding || 0) +
    (ChangeDirectory.is(item) ? 0 : 20);

  const editorNodeStyle = {
    color: decoration ? decoration.color : '',
    height: OPENED_EDITOR_TREE_NODE_HEIGHT,
    lineHeight: `${OPENED_EDITOR_TREE_NODE_HEIGHT}px`,
    paddingLeft,
  } as React.CSSProperties;

  const renderIcon = (node: ChangeDirectory | ChangeFile) => {
    const iconClass = labelService.getIcon(node.uri, {
      isDirectory: Array.isArray(node.raw.children) && node.raw.children.length,
    });
    return (
      <div
        className={cls(styles.file_icon, iconClass)}
        style={{
          height: OPENED_EDITOR_TREE_NODE_HEIGHT,
          lineHeight: `${OPENED_EDITOR_TREE_NODE_HEIGHT}px`,
        }}
      />
    );
  };

  const renderDisplayName = (node: ChangeDirectory | ChangeFile) => {
    return (
      <div
        className={cls(styles.opened_editor_node_segment, styles.opened_editor_node_display_name)}
      >
        {node.name}
      </div>
    );
  };

  const renderDescription = (node: ChangeDirectory | ChangeFile) => {
    if (!ChangeFile.is(node)) {
      return null;
    }
    return (
      <div
        className={cls(
          styles.opened_editor_node_segment_grow,
          styles.opened_editor_node_description
        )}
      >
        {node.desc}
      </div>
    );
  };

  const renderStatusTail = (node: ChangeDirectory | ChangeFile) => {
    return (
      <div className={cls(styles.opened_editor_node_segment, styles.opened_editor_node_tail)}>
        {renderChangeMarkers(node)}
      </div>
    );
  };

  const renderChangeMarkers = (node: ChangeDirectory | ChangeFile) => {
    if (!ChangeFile.is(node)) {
      return null;
    }
    return <ChangeBadge {...node.change} />;
  };

  const renderCommentIcon = () => {
    // @ts-ignore
    const commentCount = ~~decoration?.tooltip;
    return commentCount ? (
      <span className={styles.comment_count}>
        <Icon iconClass={cls('kaitian-icon', 'kticon-message', styles.comment_icon)} />
        {commentCount}
      </span>
    ) : null;
  };

  const getItemTooltip = () => {
    let tooltip = item.tooltip;
    if (decoration && decoration.badge) {
      tooltip += ` • ${decoration.tooltip}`;
    }
    return tooltip;
  };

  const renderFolderToggle = (node: ChangeDirectory, clickHandler: any) => {
    if (decorations && decorations?.classlist.indexOf(styles.mod_loading) > -1) {
      return <Loading />;
    }
    return (
      <div
        onClick={clickHandler}
        className={cls(
          styles.opened_editor_node_segment,
          styles.expansion_toggle,
          getIcon('arrow-right'),
          { [`${styles.mod_collapsed}`]: !(node as ChangeDirectory).expanded }
        )}
      />
    );
  };

  const handlerTwistierClick = (ev: React.MouseEvent) => {
    if (itemType === TreeNodeType.TreeNode || itemType === TreeNodeType.CompositeTreeNode) {
      if (onTwistierClick) {
        onTwistierClick(ev, item as ChangeFile, itemType);
      } else {
        onClick(ev, item as ChangeFile, itemType);
      }
    }
  };

  const renderTwice = (item) => {
    if (itemType === TreeNodeType.CompositeTreeNode) {
      return renderFolderToggle(item, handlerTwistierClick);
    }
  };

  return (
    <div
      key={item.id}
      onClick={handleClick}
      title={getItemTooltip()}
      className={cls(styles.opened_editor_node, decorations ? decorations.classlist : null)}
      style={editorNodeStyle}
      data-id={item.id}
    >
      <div className={cls(styles.opened_editor_node_content)}>
        {item.change && <CommentReadBadge change={item.change} className={styles.check_icon} />}
        {renderTwice(item)}
        {renderIcon(item)}
        <div className={styles.opened_editor_node_overflow_wrap}>
          {renderDisplayName(item)}
          {renderDescription(item)}
        </div>
        {renderCommentIcon()}
        {renderStatusTail(item)}
      </div>
    </div>
  );
};

export const OPENED_EDITOR_TREE_NODE_HEIGHT = 22;
