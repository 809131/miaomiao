// pages/editUserInfo/head/head.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhote: ''
  },
  handleUploadImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // console.log(res);
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        this.setData({
          userPhote: tempFilePaths
        });
      }
    })
  },

  // 使用自定义头像***********************************
  handleBtn(e) {
    // 将图片上传至数据库*********

    wx.showLoading({
      title: '上传中',
    });
    let cloudPath = "userphote/" + app.userInfo._openid + Date.now() + ".jpg";
    // 官方API 云开发文件上传***********
    // 在存储数据库中会不断存储，没有对头像做覆盖
    wx.cloud.uploadFile({
      cloudPath,
      filePath: this.data.userPhote, // 文件路径
      // success: res => {
      //   // get resource ID
      //   console.log(res.fileID)
      // },
      // fail: err => {
      //   // handle error
      // }
      // 上传成功之后************
    }).then((res) => {
      
      // console.log(res);
      let fileID = res.fileID;
      if (fileID) {
        db.collection('users').doc(app.userInfo._id).update({
          data: {
            userPhote: fileID
          }
        }).then((res) => {
          wx.hideLoading();
          wx.showToast({
            title: '上传更新成功'
          });
          app.userInfo.userPhote = fileID;
        });
      }
    })
  },

  // 使用微信头像*******************************
  bindGetUserInfo(e){
    let userInfo= e.detail.userInfo;
    if(userInfo){
      this.setData({
        userPhote:userInfo.avatarUrl
      },()=>{ 
        wx.showLoading({
          title: '上传中',
        });
        db.collection('users').doc(app.userInfo._id).update({
          data: {
            userPhote: userInfo.avatarUrl
          }
        }).then((res) => {
          wx.hideLoading();
          wx.showToast({
            title: '上传更新成功'
          });
          app.userInfo.userPhote = userInfo.avatarUrl;
        });
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 更新头像
    this.setData({
      userPhote: app.userInfo.userPhote
    })
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

  }
})