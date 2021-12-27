import { User } from './user';
import { CheckSuite } from './check-suite';

export interface Commit {
  author?: User;
  authorName: string; // 作者名字
  authorEmail: string; // 作者邮箱
  authoredDate: string; // [date]
  committer?: User;
  committedDate: string; // [date] // 提交日期
  committerName: string; // 提交人名称
  committerEmail: string; // 提交人邮箱
  createdAt: string; //date
  id: string;
  shortId: string;
  title: string; // 返回title
  message: string;
  parentIds: string[];
  signature: Signature | null;
}

export type Signature = {
  gpgKeyId: string;
  verificationStatus: string;
};

export type CommitDetail = Commit & {
  author: User;
  checkSuites?: CheckSuite[];
  committer: User;
};

export type Blame = {
  commit: Commit;
  lines: Array<{
    currentNumber: number;
    effectLine: number;
    previousNumber: number;
  }>;
};
