import { Autowired, Injectable } from "@opensumi/di";
import {
  CancellationToken,
  IAIBackService,
  IAIBackServiceOption,
  IAIBackServiceResponse,
  IAICompletionOption,
  IAIReportCompletionOption,
  IChatProgress,
} from "@opensumi/ide-core-common";
import { SumiReadableStream } from "@opensumi/ide-utils/lib/stream";
import { RuntimeConfig } from "../../common";

export class ChatReadableStream extends SumiReadableStream<IChatProgress> {}

@Injectable()
export class AIBackService implements IAIBackService<IAIBackServiceResponse, ChatReadableStream> {
  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  async request(
    input: string,
    options: IAIBackServiceOption,
    cancelToken?: CancellationToken,
  ): Promise<IAIBackServiceResponse<string>> {
    if (!this.runtimeConfig.aiNative?.service?.request) {
      console.error(new Error("AIBackService.request is not available"));
      return {};
    }

    return this.runtimeConfig.aiNative?.service?.request(input, options, cancelToken);
  }

  async requestStream(
    input: string,
    options: IAIBackServiceOption,
    cancelToken?: CancellationToken,
  ): Promise<ChatReadableStream> {
    if (!this.runtimeConfig.aiNative?.service?.requestStream) {
      console.error(new Error("AIBackService.requestStream is not available"));
      return new ChatReadableStream();
    }

    return this.runtimeConfig.aiNative?.service?.requestStream(input, options, cancelToken);
  }

  async requestCompletion(input: IAICompletionOption, cancelToken?: CancellationToken) {
    if (!this.runtimeConfig.aiNative?.service?.requestCompletion) {
      console.error(new Error("AIBackService.requestCompletion is not available"));
      return {
        sessionId: "",
        codeModelList: [{ content: "" }],
      };
    }

    return this.runtimeConfig.aiNative?.service?.requestCompletion(input, cancelToken);
  }

  async reportCompletion(input: IAIReportCompletionOption) {
    if (!this.runtimeConfig.aiNative?.service?.reportCompletion) {
      console.error(new Error("AIBackService.reportCompletion is not available"));
      return;
    }

    return this.runtimeConfig.aiNative?.service?.reportCompletion(input);
  }
}
