import React, { FC, MutableRefObject, memo, useEffect, useRef, useState, useCallback } from 'react';
import {
  message,
  Dropdown,
  Menu,
  Button,
  Tooltip,
  Avatar,
  Modal,
  Switch,
  Input,
  Popconfirm,
  Checkbox,
} from 'antd';
import moment from 'moment';
import { usePersistFn } from 'ahooks';
import styles from './style.module.less';
import { Note, NoteType } from '../types/note';
import { DiffVersion } from '../types/pr';
import { Annotation, AnnotationStatus } from '../types/annotation';
import { CheckSuite } from '../types/check-suite';
import { useAcr, useNote, useGlobal } from '../../model';
import {
  DownOutlined,
  ArrowRightOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  DoubleRightOutlined,
} from '@ant-design/icons';

export const Commenting: FC<{
  onClose?: () => void;
  lineCode?: string;
  discussionId?: number;
  path?: string;
  inputRef?: MutableRefObject<any>;
  noPadding?: boolean;
  replyNote?: Note;
  commentingLineCode?: string;
}> = (props) => {
  const { user } = useGlobal();
  const { addComment } = useNote();
  const { toVersion } = useAcr();

  const submit = usePersistFn(async (note: string, type: NoteType) => {
    try {
      await addComment({
        note,
        diffId: toVersion.id,
        lineCode: props.lineCode!,
        discussionId: props.discussionId,
        path: props.path!,
        type,
      });
      props.onClose?.();
    } catch (e) {
      console.error(e);
    }
  });

  const { replyNote } = props;

  const [note, setNote] = useState('');
  const [isProblem, setIsProblem] = useState(false);

  const onSubmit = useCallback(() => {
    const submitNote = replyNote ? insertReplyNote(note, replyNote) : note;
    submit(submitNote, isProblem ? NoteType.problem : NoteType.comment);
  }, [note, replyNote, isProblem]);

  function insertReplyNote(baseNote: string, replyNote: Note) {
    if (replyNote?.note) {
      const replyLine = replyNote.note.split('\n');
      const blockquoteNote = [`<!-- reply id="${replyNote.id}" -->`, ...replyLine]
        .map((note) => `> ${note}`)
        .join('\n');
      return blockquoteNote + '\n\n' + baseNote;
    } else {
      return baseNote;
    }
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles['commenting-container']} ${
          props.noPadding ? styles['no-padding'] : ''
        }`}
      >
        <div className={styles.avatar}>
          <Tooltip title={user.name}>
            <Avatar src={user.avatarUrl} size={24} />
          </Tooltip>
        </div>
        <Input.TextArea
          autoFocus
          placeholder="请输入描述信息"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ height: 150 }}
        />
        <div className={styles.action}>
          <div>
            <Button
              type="primary"
              onClick={onSubmit}
              disabled={!note.trim()}
              style={{ marginRight: 8 }}
            >
              开始评审
            </Button>
            {note.trim() ? (
              <Popconfirm
                title="你确定要取消？"
                okText="确定"
                cancelText="取消"
                onConfirm={props.onClose}
              >
                <Button>取消</Button>
              </Popconfirm>
            ) : (
              <Button onClick={props.onClose}>取消</Button>
            )}
          </div>
          <div>
            {replyNote && (
              <div className={styles['reply-note']}>Reply to {replyNote.author.name}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DiscussionItem: FC<{ noteId: number }> = memo((props) => {
  const { commentPack } = useNote();

  const [commenting, setCommenting] = useState(false);
  const [commentReply, setCommentReply] = useState<Note>();

  const replyIdSet = commentPack.noteIdToReplyIdSet.get(props.noteId);
  const replyIds = replyIdSet ? Array.from(replyIdSet).sort((a, b) => a - b) : null;

  const pending = (function () {
    if (!commentPack.hasPendingReview) {
      return false;
    }
    const reviewId = commentPack.noteIdToReviewId.get(props.noteId);
    if (!reviewId) return false;
    const review = reviewId ? commentPack.reviewIdToReview.get(reviewId) : null;
    if (!review) return false;
    return review.pending;
  })();
  const hasPendingNote = (function () {
    if (pending) return true;
    if (replyIds) {
      for (const replyId of replyIds) {
        const reviewId = commentPack.noteIdToReviewId.get(replyId);
        if (reviewId && commentPack.reviewIdToReview.get(reviewId)?.pending) {
          return true;
        }
      }
    }
    return false;
  })();

  const handleReply = (replyNote?: Note) => {
    if (replyNote) {
      setCommentReply(replyNote);
    }
    setCommenting(true);
  };

  useEffect(() => {
    if (!commenting) {
      setCommentReply(undefined);
    }
  }, [commenting]);

  const note = commentPack.noteIdToNote.get(props.noteId);
  if (!note) return null;

  return (
    <div className={styles.container}>
      <div>
        {note.type === NoteType.problem && (
          <>
            {note.state === 'resolved' && !pending && '已解决'}
            {note.state === 'opened' && !pending && '待解决'}
            {pending && '需要回应'}
          </>
        )}
      </div>
      <div style={{ paddingLeft: 16 }}>
        <div>
          {note.author.name} {moment(note.createdAt).fromNow()} 发表评论
        </div>
        <div>{note.note}</div>
      </div>
      {replyIds && (
        <div style={{ paddingLeft: 32 }}>
          {replyIds.map((replyId) => {
            const note = commentPack.noteIdToNote.get(replyId);
            if (!note) return null;
            return (
              <div key={replyId}>
                <div>
                  {note.author.name} {moment(note.createdAt).fromNow()} 发表评论
                </div>
                <div>{note.note}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export const Menubar = memo<{
  toggleViewerType: () => void;
  initialFullscreen: boolean;
  handleFullscreenChange: (isFullscreen: boolean) => void;
  logFullScreen: (isFullscreen: boolean) => void;
}>((props) => {
  const [isFullscreen, setFullscreen] = React.useState<boolean>(props.initialFullscreen || false);
  const handleChangeFullscreen = (isFullscreen: boolean) => {
    setFullscreen(isFullscreen);
    if (isFullscreen) {
      message.info('全屏模式支持直接使用 ↑/↓ 切换变更文件');
    }
    props.handleFullscreenChange(isFullscreen);
    props.logFullScreen(isFullscreen);
  };
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const { project, pr } = useGlobal();
  const { versions, fromVersion, toVersion, updateQuery } = useAcr();

  const idToVerbose = new Map<number, string>();
  idToVerbose.set(0, 'Base Version');
  versions.forEach((version, index) => {
    if (index === 0) {
      idToVerbose.set(version.id, `Latest Version`);
    } else {
      idToVerbose.set(version.id, `Version ${versions.length - index}`);
    }
  });

  const fromId = fromVersion?.id ?? 0;
  const toId = toVersion?.id ?? 0;

  const filterCleared = fromId === 0 && toId === versions[0]?.id;

  function renderMenuItem(version: DiffVersion, selectedId: number) {
    const verbose = idToVerbose.get(version.id);
    return (
      <Menu.Item
        className={`${styles.menuItem} ${version.id === selectedId ? styles.selected : ''}`}
        key={version.id}
      >
        <div className={styles.headRow}>
          <span>{verbose}</span>
          <span>{version.headCommitSha.slice(0, 8)}</span>
        </div>
        <div className={styles.desc}>
          {moment(version.createdAt).fromNow()}提交，包含 {version.commitsCount}，
          {version.filesCount} 份文件变更
        </div>
      </Menu.Item>
    );
  }

  const menuFrom = (
    <Menu
      onClick={(e) => {
        const val = parseInt(e.key);
        updateQuery({
          from: val === 0 ? undefined : val,
        });
      }}
    >
      {versions.slice(1).map((version) => renderMenuItem(version, fromId))}
      <Menu.Item key={0} className={`${styles.menuItem} ${fromId === 0 ? styles.selected : ''}`}>
        Base
      </Menu.Item>
    </Menu>
  );

  const menuTo = (
    <Menu
      onClick={(e) => {
        updateQuery({
          to: parseInt(e.key),
        });
      }}
    >
      {versions.slice(0, versions.length).map((version) => renderMenuItem(version, toId))}
    </Menu>
  );

  return (
    <div className={styles.menubar}>
      <div className={styles.group}>
        {versions.length !== 0 && (
          <div className={styles.versionContainer}>
            <Dropdown overlay={menuFrom} trigger={['click']}>
              <div className={styles.versionItem}>
                <span>{idToVerbose.get(fromId)}</span>
                <DownOutlined />{' '}
              </div>
            </Dropdown>
            <div>
              <ArrowRightOutlined />{' '}
            </div>
            <Dropdown overlay={menuTo} trigger={['click']}>
              <div className={styles.versionItem}>
                <span>{idToVerbose.get(toId)}</span>
                <DownOutlined />{' '}
              </div>
            </Dropdown>

            {!filterCleared && (
              <div>
                <a
                  onClick={() => {
                    updateQuery({
                      from: undefined,
                      to: undefined,
                    });
                  }}
                >
                  重置
                </a>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.group}>
        {isFullscreen ? null : (
          <div className={styles.switchContainer}>
            <span className={styles.ideLabel}>IDE 模式</span>
            <Tooltip placement="top" title="提供 IDE 代码浏览体验、完善的语言服务和高效的代码编辑">
              <Switch checked onChange={props.toggleViewerType} />
            </Tooltip>
          </div>
        )}
        {isFullscreen ? (
          <FullscreenExitOutlined onClick={() => handleChangeFullscreen(false)} />
        ) : (
          <Tooltip title="全屏">
            <FullscreenOutlined onClick={() => handleChangeFullscreen(true)} />
          </Tooltip>
        )}
      </div>
    </div>
  );
});

export const AnnotationEntry = memo<{
  annotation: Annotation;
  checkSuite: CheckSuite;
}>((props) => {
  const { annotation, checkSuite } = props;

  // 定位
  const anchorOffsetRef = useRef<HTMLDivElement>(null);
  const hash = `#annotation_${annotation.id}`;
  const hashActive = hash === location.hash;
  useEffect(() => {
    setTimeout(() => {
      if (hashActive) {
        anchorOffsetRef.current?.scrollIntoView(true);
      }
    }, 500);
  });

  const [isIgnore, setIsIgnore] = useState(annotation.feedBackStatus === AnnotationStatus.Ignore);

  return (
    <div className={styles.container}>
      <div
        ref={anchorOffsetRef}
        id={`annotation_${annotation.id}`}
        className={styles.annotationContainer}
      >
        <div className={styles.codeLine}>
          <div>{annotation.level}</div>
          <div className={styles.line}>
            {annotation.startLine === annotation.endLine ? (
              <span>
                对{annotation.endLine}
                行代码分析
              </span>
            ) : (
              <span>
                对{annotation.startLine}到{annotation.endLine}
                行代码分析
              </span>
            )}
          </div>
        </div>
        <div className={styles.botRow}>
          <Avatar
            alt={checkSuite.service.nameShow}
            size={20}
            src="https://gw-office.alipayobjects.com/bmw-prod/a9596840-928c-4603-a865-b24373ab4b4d.png"
          />
          <div>
            <div className={styles.strong}>{checkSuite.service.nameShow}</div>
          </div>
        </div>
        <div className={styles.content}>
          <p>{annotation.title}</p>
          <div>{annotation.message}</div>
        </div>
        <div className={styles.detail}>
          <div>
            {annotation.bugId ? (
              isIgnore ? (
                <Button type="primary" style={{ marginRight: 8 }}>
                  取消忽略
                </Button>
              ) : (
                <>
                  <Button style={{ marginRight: 8 }}>忽略</Button>
                  <Button style={{ marginRight: 8 }}>误报</Button>
                  <Button>确认</Button>
                </>
              )
            ) : null}
          </div>
          <div>
            <a
              className={styles.halfPlainA}
              href={`https://codeinsightapi.alipay.com/api/v1/describe?bug_type=${annotation.bugType}&bug_id=${annotation.bugId}`}
              target="_blank"
            >
              查看问题详情 <DoubleRightOutlined />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

export const PRMoreActionLinks = ({ setVisible }: { setVisible: (visible: boolean) => void }) => {
  const { project, pr } = useGlobal();
  const [checkoutBranchVisible, setCheckoutBranchVisible] = useState(false);

  return (
    <>
      <div
        className={styles.checkoutBranch}
        onClick={() => {
          setCheckoutBranchVisible(true);
          setVisible(false);
        }}
      >
        检出分支
      </div>
      <a
        className={styles.flexA}
        download
        href={`http://code.test.alipay.net/${project.pathWithNamespace}/pull_requests/${pr.iid}.patch`}
      >
        <span onClick={() => setVisible(false)}>下载 patch 文件</span>
      </a>
      <a
        className={styles.flexA}
        download
        href={`http://code.test.alipay.net/${project.pathWithNamespace}/pull_requests/${pr.iid}.diff`}
      >
        <span onClick={() => setVisible(false)}>下载 diff 文件</span>
      </a>
      <Modal
        title="检出，评审，并在本地执行合并"
        visible={checkoutBranchVisible}
        footer={null}
        onCancel={() => setCheckoutBranchVisible(false)}
      >
        <div className={styles.checkout}>
          <p>
            <span className="fw">Step 1.</span> Fetch and check out the branch for this pull request
          </p>
          <pre>
            git fetch origin
            <br />
            {`git checkout -b ${pr.sourceBranch} origin/${pr.sourceBranch}`}
          </pre>
          <p>
            <span className="fw">Step 2.</span> Review the changes locally
          </p>
          <p>
            <span className="fw">Step 3.</span> Merge the branch and fix any conflicts that come up
          </p>
          <pre>
            git fetch origin
            <br />
            {`git checkout origin/${pr.targetBranch}`}
            <br />
            git merge --no-ff master
          </pre>
          <p>
            <span className="fw">Step 4.</span> Push the result of the merge
          </p>
          <pre>{`git push origin ${pr.targetBranch}`}</pre>
        </div>
      </Modal>
    </>
  );
};
