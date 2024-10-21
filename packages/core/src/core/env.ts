import { getResource } from "@codeblitzjs/ide-common";

/**
 * codeblitz version
 */
export const VERSION = __VERSION__;
/**
 * worker url
 */
export const EXT_WORKER_HOST = getResource("@codeblitzjs/ide-sumi-core", "resources/worker-host.js", VERSION);
