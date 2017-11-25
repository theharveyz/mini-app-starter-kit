import { MONITOR_HOST } from '../constants/app';
import { httpHost, httpPost } from '../decorators/http';

@httpHost(MONITOR_HOST)
export default class Auth {

  // token获取
  @httpPost(true)('/logout')
  logout() {
    return {
      data: {}
    };
  }
  // token获取
  @httpPost()('/api/auth/token')
  token(code) {
    return {
      data: {
        code
      }
    };
  }
};
