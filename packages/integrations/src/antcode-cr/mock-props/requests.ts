import { request } from '../antcode/fetch';

import {
  FileAction,
  FileActionHeader,
} from '../../src/modules/antcode-service/interfaces/file-action';
import { AntcodeEncodingType } from '../../src/modules/antcode-service/base';

import { LSIFRange } from '../../src/modules/antcode-service/interfaces/lsif';

export const getFileContent = (projectId: number) => (filepath: string, ref: string) => {
  const params = {
    filepath,
    max_size: 2500000,
  } as any;

  // const currentEncoding = getCharsetName();
  // if (currentEncoding) {
  //   params.charset_name = currentEncoding.toUpperCase();
  // }

  return request(
    `/antcode/api/v3/projects/${projectId}/repository/blobs/${encodeURIComponent(ref)}`,
    { params }
  );
};

// antcode 测试环境目前尚不支持该接口
export const getLanguages = (projectId: number) => (): Promise<string[]> => {
  return request(`api/v4/projects/${projectId}/languages`, {
    params: {
      order_by: 'count',
      agg_by: 'file_extension',
      size: 20,
    },
  }).then((res) => res && Object.keys(res));
};

export const bulkChangeFiles = (projectId: number) => (
  actions: FileAction[],
  header: FileActionHeader
) => {
  return request(`/antcode/api/v4/projects/${projectId}/repository/files`, {
    method: 'POST',
    data: {
      actions,
      header,
    },
  });
};

// TODO: update
export function lsifExists(projectId: number, commitId: string): Promise<boolean> {
  return request(`/antcode/webapi/projects/${projectId}/repository/lsif/exists`, {
    method: 'POST',
    params: {
      sha: commitId,
    },
    data: {
      sha: commitId,
    },
  });
}

export function lsifHover(
  projectId: number,
  params: any
): Promise<{
  contents: {
    kind: string;
    value: string;
  };
  range: LSIFRange;
}> {
  // return Promise.resolve({
  //   "contents": [
  //     {
  //       "kind": "markdown",
  //       "value": "```java\ncom.alipay.languagebase.domain.model.job.JobException\n```\n"
  //     },
  //     {
  //       "kind": "markdown",
  //       "value": "for test"
  //     },
  //   ] as any,
  //   "range": {
  //     "end": {
  //       "character": 25,
  //       "line": 5
  //     },
  //     "start": {
  //       "character": 13,
  //       "line": 5
  //     }
  //   }
  // });
  return request(`/antcode/webapi/projects/${projectId}/repository/lsif/hover`, {
    method: 'POST',
    data: params,
  });
}

export function lsifDefinitions(
  projectId: number,
  params: any
): Promise<{ uri: string; range: LSIFRange }[]> {
  return request(`/antcode/webapi/projects/${projectId}/repository/lsif/definitions`, {
    method: 'POST',
    data: params,
  });
}

export function lsifReferencesV2(
  projectId: number,
  params: any
): Promise<
  {
    range: Range;
    uri: string;
  }[]
> {
  return request(`/antcode/webapi/projects/${projectId}/repository/lsif/reference/v2`, {
    method: 'POST',
    data: params,
  });
}

// fetch('https://code.alipay.com/api/v3/projects/128302/pull_requests/2354056/changes')
export function getPrChanges(projectId: number, prId: number) {
  return request(`/antcode/api/v3/projects/${projectId}/pull_requests/${prId}/changes`, {});
}

// fetch('https://code.alipay.com/api/v3/projects/128302/pull_requests/2354056')
// https://code.alipay.com/webapi/projects/185/get_pull_request_by_iid?iid=186
export function getPrDetail(projectId: number, prIid: number) {
  return request(`/antcode/webapi/projects/${projectId}/get_pull_request_by_iid?iid=${prIid}`, {});
}

// https://code.alipay.com/webapi/projects/128302/pull_requests/1333187/changes/178419?charset_name=UTF-8&_output_charset=utf-8&_input_charset=utf-8
export function getDiffById(projectId: number, prId: number, changeId: number) {
  return request(
    `/antcode/webapi/projects/${projectId}/pull_requests/${prId}/changes/${changeId}`,
    {}
  );
}
