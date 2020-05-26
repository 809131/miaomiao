// pages/detail/detail.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    isFirend: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let userId = options.userId;
    db.collection('users').doc(userId).get().then((res) => {
      this.setData({
        detail: res.data
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleAddFirend() {
    // 发起好友申请，添加好友
    if ( app.userInfo._id ) {
      // 查询用户数据
      db.collection('message').where({
        userId : this.data.detail._id
      }).get().then((res) => {
        if (res.data.length) { //查询到数据 更新进行判断用户是否存在
          if (res.data[0].list.includes(app.userInfo._id)) { //数组方法includes()判断里面的内容是否存在
            wx.showToast({
              title: '已申请！'
            })
          } else { //更新云函数
            wx.cloud.callFunction({
              name: 'updata',
              data: {
                collection: 'message',
                where: {
                  userId: this.data.detail._id
                },
                data: `{list:_.unshift('${app.userInfo._id}')}` //后端id为字符串形式，需要加引号***   
              }
            }).then((res) => {
              wx.showToast({
                title: '申请成功~'
              })
            });
          }
        } else { //添加   add({})云函数添加数据库请求add文档
          db.collection('message').add({
            data: {
              userId: this.data.detail._id,
              list: [app.userInfo._id]
            }
          }).then((res) => {
            wx.showToast({
              title: '申请成功'
            })
          });
        }
      });
    } else {
      wx.showToast({
        title: '请先登录',
        // 时间保持2s
        duration: 2000,
        // 不让其显示图标
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/user/user'
            })
          }, 2000);
        }
      })
    }
  }
})