let callback = {
  open: null,
  dismiss: null
};

export function subscribe (which, cb) {
  callback[which] = cb;
}

export function open (message, type, timedout) {
  return callback.open(message, type, timedout);
}

export function dismiss () {
  callback.dismiss();
}