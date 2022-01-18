import React from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button, Switch } from 'antd';
import 'antd/dist/antd.css';

import AntcodeCR from '@alipay/alex-acr';
import { IAntcodeCRProps } from '@alipay/alex-acr/lib/modules/antcode-service/base';
import { Uri } from '@alipay/alex';
import * as path from 'path';
import { usePersistFn } from 'ahooks';

import { Provider, useGlobal, useNote, useReadMark, useAcr, useSetting } from './model';
import {
  DiscussionItem,
  Commenting,
  Menubar,
  AnnotationEntry,
  PRMoreActionLinks,
} from './antcode/components';
import { projectService } from './antcode/project.service';
import { lsifService } from './antcode/lsif.service';
import { FileActionHeader, FileAction } from './antcode/types/file-action';
import { useFileReadMarkChange$ } from './hooks';
import { useLoadLocalExtensionMetadata } from '../common/local-extension.module';
import acrPlugin from '../common/plugin';
import CodeScaningPlugin from '../common/code-scaning.plugin';
import CodeScaning from '@alipay/alex/extensions/cloud-ide-ext.antcode-scaning';
import './style.less';

const App = () => {
  const [visible, setVisible] = React.useState<boolean>(true);
  const [count, setCount] = React.useState<number>(0);
  const [isFullscreen, setFullscreen] = React.useState<boolean>(false);

  const { project, pr, user } = useGlobal();
  const { locale, setLocale, gbk, setGBK } = useSetting();

  const { commentPack } = useNote();
  const {
    getFileReadStatus: _getFileReadStatus,
    markFileAsRead,
    markFileAsUnread,
    readMarks,
  } = useReadMark();
  const getFileReadStatus = usePersistFn(_getFileReadStatus);

  const { diffsPack, getDiffById, getFileContent, IDEMode, toggleViewerType, annotationPacks } =
    useAcr();
  const fileReadMarkChange$ = useFileReadMarkChange$(diffsPack?.diffs ?? [], readMarks);

  useEffect(() => {
    // map 需要转译
    CodeScaningPlugin.commands?.executeCommand(
      'antcode-cr.plugin.update.comments',
      Array.from(commentPack.noteIdToNote.entries())
    );

    let noteIdToReplyIdSet: [number, number[]][] = [];
    for (let [key, value] of commentPack.noteIdToReplyIdSet) {
      noteIdToReplyIdSet.push([key, [...value]]);
    }
    CodeScaningPlugin.commands?.executeCommand(
      'antcode-cr.plugin.update.replaySet',
      noteIdToReplyIdSet
    );
  }, [commentPack.updateFlag]);
  useEffect(() => {
    CodeScaningPlugin.commands?.executeCommand(
      'antcode-cr.plugin.update.annotations',
      annotationPacks
    );
  }, [annotationPacks]);

  if (!diffsPack) return null;

  const props = {
    noteIdToReplyIdSet: commentPack.noteIdToReplyIdSet,
    addLineNum: diffsPack.addLineNum,
    deleteLineNum: diffsPack.delLineNum,
    prevSha: diffsPack.fromVersion?.headCommitSha ?? diffsPack.toVersion.baseCommitSha,
    nextSha: diffsPack.toVersion.headCommitSha,
    toggleViewerType,
    DiscussionItem,
    Commenting,
    getFileContent,
    lineToNoteIdSet: commentPack.lineToNoteIdSet,
    noteIdToNote: commentPack.noteIdToNote,
    noteUpdateFlag: commentPack.updateFlag,
    getDiffById,
    diffs: diffsPack.diffs,
    latestCommitSha: pr.diff.headCommitSha,
    projectId: project.id,
    projectPath: project.pathWithNamespace,
    pullRequestId: pr.id,
    pr,
    getLanguages: () =>
      projectService
        .getLanguages(project.id, {
          aggBy: 'file_extension',
          // 按照语言文件个数排序
          orderBy: 'count',
          size: 20,
        })
        .then((res) => res && Object.keys(res)),
    getFileReadStatus,
    fileReadMarkChange$,
    markFileAsRead,
    markFileAsUnread,
    bulkChangeFiles: (actions: FileAction[], header: FileActionHeader) =>
      projectService.bulkChangeFiles(project.id, actions, header),
    Menubar: () => (
      <Menubar
        initialFullscreen={isFullscreen}
        handleFullscreenChange={setFullscreen}
        toggleViewerType={toggleViewerType}
        logFullScreen={(bool) => console.log('>>>logFullScreen', bool)}
      />
    ),
    user,
    lsifService,
    defaultEncoding: project.encoding,
    encoding: gbk ? 'gbk' : 'utf-8',
    setEncoding: (val: 'gbk' | 'utf-8') => {
      setGBK(val === 'gbk');
    },
    locale,
    // annotation related
    annotations: annotationPacks,
    AnnotationEntry,
    PRMoreActionLinks,
    // 全屏模式
    isFullscreen,

    appConfig: {
      staticServicePath: Uri.parse(window.location.href)
        .with({ path: path.join('/antcode', project.pathWithNamespace, 'raw') })
        .toString(),
      plugins: [acrPlugin, CodeScaningPlugin],
      extensionMetadata: [CodeScaning],
    },
  } as IAntcodeCRProps;

  const IDEContainerStyle: React.CSSProperties = {
    position: isFullscreen ? 'fixed' : 'static',
    left: 0,
    top: 0,
    width: '100%',
    height: isFullscreen ? '100vh' : 'calc(100vh - 72px)',
    zIndex: 1000,
  };

  return (
    <div style={{ height: '100%' }}>
      <div className="controller">
        <Button onClick={() => setVisible((r) => !r)}>destroy by toggle</Button>
        <Button onClick={() => setCount((v) => v + 1)}>reset</Button>
        <Button onClick={setLocale}>toggle locale: current locale {locale}</Button>
        <Button
          onClick={() => {
            acrPlugin.commands?.executeCommand('plugin.command.test', 1, 2);
          }}
        >
          plugin command test
        </Button>

        <div style={{ border: '1px solid #000', textAlign: 'center' }}>
          <div>code scaning mock</div>
          <Button
            onClick={() => {
              let mock = {
                author: {
                  avatarUrl: 'https://work.antfinancial-corp.com/photo/80222.80x80.jpg',
                  email: 'xinglong.wangwxl@antgroup.com',
                  externUid: '80222',
                  id: 15168,
                  name: '蛋总',
                  state: 'active',
                  username: 'xinglong.wangwxl',
                  webUrl: 'https://work.antfinancial-corp.com/nwpipe/u/80222',
                },
                commitId: null,
                createdAt: '2021-11-04T15:08:12+0800',
                discussionId: null,
                id: 400003,
                isAward: false,
                labels: [],
                lineCode: 'c17950853d6b9677e9822cf07f2616db7ca02797_388_384',
                lineType: 'old',
                note: '111 \n\n\n![image.png](/ide-s/TypeScript-Node-Starter/uploads/cd8f399b2c994d01b4afe179c26e5a4f/image.png)\n',
                noteableId: 4200244,
                noteableType: 'ReviewComment',
                outdated: false,
                path: 'src/controllers/user.ts',
                resolvedAt: null,
                resolvedBy: null,
                stDiff: {
                  aMode: '100644',
                  addLineNum: 265,
                  bMode: '100644',
                  binaryFile: false,
                  charsetName: 'UTF-8',
                  commitSha: 'ab32441adfd6c3c381457717a42f19a7fdd6d59b',
                  compareDiffId: 31918,
                  delLineNum: 265,
                  deletedFile: false,
                  diff: '@@ -327,62 +327,62 @@ export const getForgot = (req: Request, res: Response) => {\n  * Create a random token, then the send user an email with a reset link.\n  */\n export const postForgot = async (req: Request, res: Response, next: NextFunction) => {\n-    await check("email", "Please enter a valid email address.").isEmail().run(req);\n-    // eslint-disable-next-line @typescript-eslint/camelcase\n-    await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);\n-\n-    const errors = validationResult(req);\n-\n-    if (!errors.isEmpty()) {\n-        req.flash("errors", errors.array());\n-        return res.redirect("/forgot");\n-    }\n-\n-    async.waterfall([\n-        function createRandomToken(done: Function) {\n-            crypto.randomBytes(16, (err, buf) => {\n-                const token = buf.toString("hex");\n-                done(err, token);\n-            });\n-        },\n-        function setRandomToken(token: AuthToken, done: Function) {\n-            User.findOne({ email: req.body.email }, (err, user: any) => {\n-                if (err) { return done(err); }\n-                if (!user) {\n-                    req.flash("errors", { msg: "Account with that email address does not exist." });\n-                    return res.redirect("/forgot");\n-                }\n-                user.passwordResetToken = token;\n-                user.passwordResetExpires = Date.now() + 3600000; // 1 hour\n-                user.save((err: WriteError) => {\n-                    done(err, token, user);\n-                });\n-            });\n-        },\n-        function sendForgotPasswordEmail(token: AuthToken, user: UserDocument, done: Function) {\n-            const transporter = nodemailer.createTransport({\n-                service: "SendGrid",\n-                auth: {\n-                    user: process.env.SENDGRID_USER,\n-                    pass: process.env.SENDGRID_PASSWORD\n-                }\n-            });\n-            const mailOptions = {\n-                to: user.email,\n-                from: "hackathon@starter.com",\n-                subject: "Reset your password on Hackathon Starter",\n-                text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\\n\\n\n+  await check("email", "Please enter a valid email address.").isEmail().run(req);\n+  // eslint-disable-next-line @typescript-eslint/camelcase\n+  await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);\n+\n+  const errors = validationResult(req);\n+\n+  if (!errors.isEmpty()) {\n+    req.flash("errors", errors.array());\n+    return res.redirect("/forgot");\n+  }\n+\n+  async.waterfall([\n+    function createRandomToken(done: Function) {\n+      crypto.randomBytes(16, (err, buf) => {\n+        const token = buf.toString("hex");\n+        done(err, token);\n+      });\n+    },\n+    function setRandomToken(token: AuthToken, done: Function) {\n+      User.findOne({ email: req.body.email }, (err, user: any) => {\n+        if (err) { return done(err); }\n+        if (!user) {\n+          req.flash("errors", { msg: "Account with that email address does not exist." });\n+          return res.redirect("/forgot");\n+        }\n+        user.passwordResetToken = token;\n+        user.passwordResetExpires = Date.now() + 3600000; // 1 hour\n+        user.save((err: WriteError) => {\n+          done(err, token, user);\n+        });\n+      });\n+    },\n+    function sendForgotPasswordEmail(token: AuthToken, user: UserDocument, done: Function) {\n+      const transporter = nodemailer.createTransport({\n+        service: "SendGrid",\n+        auth: {\n+          user: process.env.SENDGRID_USER,\n+          pass: process.env.SENDGRID_PASSWORD\n+        }\n+      });\n+      const mailOptions = {\n+        to: user.email,\n+        from: "hackathon@starter.com",\n+        subject: "Reset your password on Hackathon Starter",\n+        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\\n\\n\n           Please click on the following link, or paste this into your browser to complete the process:\\n\\n\n           http://${req.headers.host}/reset/${token}\\n\\n\n           If you did not request this, please ignore this email and your password will remain unchanged.\\n`\n-            };\n-            transporter.sendMail(mailOptions, (err) => {\n-                req.flash("info", { msg: `An e-mail has been sent to ${user.email} with further instructions.` });\n-                done(err);\n-            });\n-        }\n-    ], (err) => {\n-        if (err) { return next(err); }\n-        res.redirect("/forgot");\n-    });\n+      };\n+      transporter.sendMail(mailOptions, (err) => {\n+        req.flash("info", { msg: `An e-mail has been sent to ${user.email} with further instructions.` });\n+        done(err);\n+      });\n+    }\n+  ], (err) => {\n+    if (err) { return next(err); }\n+    res.redirect("/forgot");\n+  });\n };\n',
                  id: 1088,
                  newFile: false,
                  newPath: 'src/controllers/user.ts',
                  oldPath: 'src/controllers/user.ts',
                  renamedFile: false,
                  tooLarge: false,
                },
                state: 'opened',
                system: false,
                type: 'Problem',
                updatedAt: '2021-11-04T15:08:12+0800',
                noteId: 400003,
              };
              let noteIdToNote = Array.from(commentPack.noteIdToNote.entries());
              // @ts-ignore
              noteIdToNote.push([400003, mock]);

              CodeScaningPlugin.commands?.executeCommand(
                'antcode-cr.plugin.update.comments',
                noteIdToNote
              );
            }}
          >
            comments
          </Button>
          <Button
            onClick={() => {
              let mock = [
                {
                  annotation: {},
                  checkSuite: {
                    checkRuns: [
                      {
                        annotations: [
                          {
                            bugId: '172261039',
                            bugType: 'BE8034',
                            bugTypeName: 'Hard code access key',
                            checkRunId: 32814683,
                            details:
                              '源文件发现硬编码明文账密: "ACCESSSECRET" : "XuixzcoxU56iSrNbhm8Wz2WH1DkjmO"',
                            endCol: 0,
                            endLine: 22,
                            feedBackStatus: 'Init',
                            feedBackUser: {
                              avatarUrl:
                                'https://work.antfinancial-corp.com/photo/249871.80x80.jpg',
                              email: 'yongda.cyd@antgroup.com',
                              externUid: '249871',
                              id: 48448,
                              name: '鲁猫',
                              state: 'active',
                              username: 'yongda.cyd',
                              webUrl: 'https://work.antfinancial-corp.com/nwpipe/u/249871',
                            },
                            feedBackUserId: 48448,
                            id: 18402298,
                            level: 'Failure',
                            message:
                              '源文件发现硬编码明文账密: "<span style="color:red">ACCESSSECRET</span>" : "<span style="color:red">XuixzcoxU56iSrNbhm8Wz2WH1DkjmO</span>"<br/>不符合《[蚂蚁金服密钥口令安全管理规范](https://developer.alipay.com/processfile/devKb/sggf2g)》',
                            path: 'aaa/package.json',
                            startCol: 0,
                            startLine: 22,
                            title: '硬编码Access Key',
                          },
                          {
                            bugId: '172261040',
                            bugType: 'BE8034',
                            bugTypeName: 'Hard code access key',
                            checkRunId: 32814683,
                            details:
                              '源文件发现硬编码明文账密: "ACCESSSECRET" : "XuixzcoxU56iSrNbhm8Wz2WH1DkjmO"',
                            endCol: 0,
                            endLine: 26,
                            feedBackStatus: 'Init',
                            feedBackUser: {
                              avatarUrl:
                                'https://work.antfinancial-corp.com/photo/249871.80x80.jpg',
                              email: 'yongda.cyd@antgroup.com',
                              externUid: '249871',
                              id: 48448,
                              name: '鲁猫',
                              state: 'active',
                              username: 'yongda.cyd',
                              webUrl: 'https://work.antfinancial-corp.com/nwpipe/u/249871',
                            },
                            feedBackUserId: 48448,
                            id: 18402299,
                            level: 'Failure',
                            message:
                              '源文件发现硬编码明文账密: "<span style="color:red">ACCESSSECRET</span>" : "<span style="color:red">XuixzcoxU56iSrNbhm8Wz2WH1DkjmO</span>"<br/>不符合《[蚂蚁金服密钥口令安全管理规范](https://developer.alipay.com/processfile/devKb/sggf2g)》',
                            path: 'src/config/passport.ts',
                            startCol: 0,
                            startLine: 26,
                            title: '硬编码Access Key',
                          },
                          {
                            bugId: '172261041',
                            bugType: 'BE8034',
                            bugTypeName: 'Hard code access key',
                            checkRunId: 32814683,
                            details:
                              '源文件发现硬编码明文账密: "ACCESSSECRET" : "XuixzcoxU56iSrNbhm8Wz2WH1DkjmO"',
                            endCol: 0,
                            endLine: 22,
                            feedBackStatus: 'Init',
                            feedBackUser: {
                              avatarUrl:
                                'https://work.antfinancial-corp.com/photo/249871.80x80.jpg',
                              email: 'yongda.cyd@antgroup.com',
                              externUid: '249871',
                              id: 48448,
                              name: '鲁猫',
                              state: 'active',
                              username: 'yongda.cyd',
                              webUrl: 'https://work.antfinancial-corp.com/nwpipe/u/249871',
                            },
                            feedBackUserId: 48448,
                            id: 18402300,
                            level: 'Failure',
                            message:
                              '源文件发现硬编码明文账密: "<span style="color:red">ACCESSSECRET</span>" : "<span style="color:red">XuixzcoxU56iSrNbhm8Wz2WH1DkjmO</span>"<br/>不符合《[蚂蚁金服密钥口令安全管理规范](https://developer.alipay.com/processfile/devKb/sggf2g)》',
                            path: 'test0315.java',
                            startCol: 0,
                            startLine: 22,
                            title: '硬编码Access Key',
                          },
                          {
                            bugId: '172261042',
                            bugType: 'BE8034',
                            bugTypeName: 'Hard code access key',
                            checkRunId: 32814683,
                            details:
                              '源文件发现硬编码明文账密: "ACCESSSECRET" : "fFc3rGhaDMgbHtN6EGLirC4DRWWmhg"',
                            endCol: 0,
                            endLine: 21,
                            feedBackStatus: 'Init',
                            feedBackUser: {
                              avatarUrl:
                                'https://work.antfinancial-corp.com/photo/249871.80x80.jpg',
                              email: 'yongda.cyd@antgroup.com',
                              externUid: '249871',
                              id: 48448,
                              name: '鲁猫',
                              state: 'active',
                              username: 'yongda.cyd',
                              webUrl: 'https://work.antfinancial-corp.com/nwpipe/u/249871',
                            },
                            feedBackUserId: 48448,
                            id: 18402301,
                            level: 'Failure',
                            message:
                              '源文件发现硬编码明文账密: "<span style="color:red">ACCESSSECRET</span>" : "<span style="color:red">fFc3rGhaDMgbHtN6EGLirC4DRWWmhg</span>"<br/>不符合《[蚂蚁金服密钥口令安全管理规范](https://developer.alipay.com/processfile/devKb/sggf2g)》',
                            path: 'test0317.java',
                            startCol: 0,
                            startLine: 21,
                            title: '硬编码Access Key',
                          },
                          {
                            bugId: '172261044',
                            bugType: 'BE8034',
                            bugTypeName: 'Hard code access key',
                            checkRunId: 32814683,
                            details:
                              '源文件发现硬编码明文账密: "ACCESSSECRET" : "XuixzcoxU56iSrNbhm8Wz2WH1DkjmO"',
                            endCol: 0,
                            endLine: 19,
                            feedBackStatus: 'Init',
                            feedBackUser: {
                              avatarUrl:
                                'https://work.antfinancial-corp.com/photo/249871.80x80.jpg',
                              email: 'yongda.cyd@antgroup.com',
                              externUid: '249871',
                              id: 48448,
                              name: '鲁猫',
                              state: 'active',
                              username: 'yongda.cyd',
                              webUrl: 'https://work.antfinancial-corp.com/nwpipe/u/249871',
                            },
                            feedBackUserId: 48448,
                            id: 18402302,
                            level: 'Failure',
                            message:
                              '源文件发现硬编码明文账密: "<span style="color:red">ACCESSSECRET</span>" : "<span style="color:red">XuixzcoxU56iSrNbhm8Wz2WH1DkjmO</span>"<br/>不符合《[蚂蚁金服密钥口令安全管理规范](https://developer.alipay.com/processfile/devKb/sggf2g)》',
                            path: 'bugs.java',
                            startCol: 0,
                            startLine: 19,
                            title: '硬编码Access Key',
                          },
                        ],
                        completedAt: '2021-09-14T18:03:39+0800',
                        context:
                          '\n<span style="color: rgb(251, 103, 58);">🔴 失败</span>: 5 <span style="color: rgb(250, 140, 22);"> 🟠️ 警告</span>: 0 <span style="color: rgb(250, 173, 20);"> ⚪ 通知</span>: 0\n\n已扫描项:\n- 硬编码Access Key &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: green;">完成</span>, 发现5个失败级别风险&nbsp;&nbsp;\n\n',
                        createdAt: '2021-09-14T18:02:51+0800',
                        detailUrl: '',
                        externalId: '186602538',
                        id: 32814683,
                        startedAt: '2021-09-14T18:02:51+0800',
                        status: 'fail',
                        suiteId: 32348046,
                        summary: '扫描任务执行完成，发现 5 个结果',
                        title: 'AntCode CR 增量扫描',
                        updatedAt: '2021-09-14T18:03:40+0800',
                        conclusion: '',
                      },
                    ],
                    service: {
                      accessLevel: 20,
                      active: true,
                      avatarUrl: '/uploads/service/avatar/5/27973167.jpg',
                      checks: true,
                      checksDependOn: null,
                      description:
                        '提供自动化代码扫描检测方案，比如蚂蚁军规、代码明文账密等，并支持用户自定义等。',
                      helpUrl: null,
                      homepage: 'https://codeinsightapi.alipay.com',
                      id: 5,
                      name: 'CodeInsight',
                      nameShow: '代码规范扫描',
                      rerunForRun: false,
                      rerunForSuite: true,
                      serviceType: 'BASICQUALITY',
                      stuck: false,
                    },
                  },
                },
              ];

              CodeScaningPlugin.commands?.executeCommand(
                'antcode-cr.plugin.update.annotations',
                mock
              );
            }}
          >
            annotations
          </Button>
          <Button
            onClick={() => {
              let mock = [[78, [86, 179, 178]]];
              CodeScaningPlugin.commands?.executeCommand(
                'antcode-cr.plugin.update.replyIdSet',
                mock
              );
            }}
          >
            replyIdSet
          </Button>
        </div>

        {!IDEMode && (
          <>
            IDE 模式: <Switch checked={IDEMode} onChange={toggleViewerType} />
          </>
        )}
      </div>
      <div className="pr-head">
        <div>{pr.description}</div>
        <div>
          评审人：
          {pr.review?.reviewers?.map((r) => (
            <span style={{ marginRight: 4 }} key={r.id}>
              {r.name}
            </span>
          ))}
          <span style={{ marginRight: 24 }}></span>
          合并人：{pr.assignee?.name}
        </div>
      </div>
      {IDEMode && (
        <div style={IDEContainerStyle}>{visible && <AntcodeCR {...props} key={count} />}</div>
      )}
    </div>
  );
};

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('main')!
);
