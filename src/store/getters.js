const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  staffphoto: state => state.user.userInfo.staffphoto,
  companyId: state => state.user.userInfo.companyId // 建立对于user模块的companyId的快捷访问

}
export default getters
