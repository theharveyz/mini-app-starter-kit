export default class Broadcast {
  // 通知
  notifications = {};

  publish(notification, ...params) {
    if (!this.notifications.hasOwnProperty(notification)) {
      // throw new Error(`The notification ${notification} is not found`);
      return false;
    }
    const listeners = this.notifications[notification];
    listeners.forEach(listener => {
      setTimeout(() => {
        listener(...params);
      }, 0);
    });
  }

  subscribe(notification, fn) {
    const listeners = this.notifications.hasOwnProperty(notification) ? this.notifications[notification] : [];
    if (!(typeof fn === 'function')) {
      throw new Error(`The notification listener is not a function`);
    }
    listeners.push(fn);
    this.notifications[notification] = listeners;
  }

  unsubscribe(notification) {
    if (this.notifications.hasOwnProperty(notification)) {
      this.notifications[notification] = [];
    }
  }
}
