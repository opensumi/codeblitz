export function endianness() {
  return 'LE';
}

export function hostname() {
  if (typeof location !== 'undefined') {
    return location.hostname;
  } else return '';
}

export function loadavg() {
  return [];
}

export function uptime() {
  return 0;
}

export function freemem() {
  return Number.MAX_VALUE;
}

export function totalmem() {
  return Number.MAX_VALUE;
}

export function cpus() {
  return [];
}

export function type() {
  return 'Browser';
}

export function release() {
  if (typeof navigator !== 'undefined') {
    return navigator.appVersion;
  }
  return '';
}

export function arch() {
  return 'javascript';
}

export function platform() {
  return 'browser';
}

export function tmpdir() {
  return '/tmp';
}

export const EOL = '\n';

export function homedir() {
  return '/home';
}
