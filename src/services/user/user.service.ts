import http from "../http-common";

class UserService {
  getUserDeviceById(deviceId: string) {
    return http.get(`/admin/device/${deviceId}`);
  }

}

export default new UserService();