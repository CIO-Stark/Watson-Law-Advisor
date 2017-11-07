let callback = {
  open: null,
  dismiss: null
};

export function subscribe (which, cb) {
  callback[which] = cb;
}

export function open (content, fakeOpen) {
  if (!fakeOpen) {
    setTimeout(() => { callback.open(content); });
  }
}

export function hasCallback () {
  return callback.open ? true : false;
}

export function dismiss () {
  setTimeout(callback.dismiss);
}