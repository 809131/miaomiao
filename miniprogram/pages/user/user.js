// pages/user/user.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhote:"/images/user/user-unlogin.png",
    nickName:"一只小喵喵",
    logined:false,
    disabled:true
  },
  bindget(){
    console.log(app.userInfo)
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
    wx.cloud.callFunction({
      name:'login',
      data:{}
    }).then((res)=>{
      // console.log(res);
      db.collection('users').where({
        _openid : res.result.openid
      }).get().then((res)=>{
        if(res.data.length){
         app.userInfo = Object.assign(app.userInfo,res.data[0]);
         this.setData({
          userPhote: app.userInfo.userPhote,
          nickName:app.userInfo.nickName,
          logined:true
         });
         this.getMessage();
        }else{
          this.setData({
            disabled:false
          });
        }
      });
    });
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userPhote: app.userInfo.userPhote,
      nickName: app.userInfo.nickName
    });
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
  bindGetUserInfo(e){
    // console.log(e)
    let userInfo=e.detail.userInfo;
    if(!this.data.logined && userInfo){
      db.collection('users').add({
        data:{
          userPhote:userInfo.avatarUrl,
          nickName:userInfo.nickName,
          signature:'',
          phoneNumber:'',
          weixinNumber:'',
          links:0,
          time:new Date(),
          isLocation:true
        }
      }).then((res)=>{
        console.log('添加执行成功！');
        db.collection('users').doc(res._id).get().then((res)=>{
          // console.log(res.data);
          app.userInfo = Object.assign(app.userInfo,res.data);
          this.setData({
            userPhote:app.userInfo.userPhote,
            nickName:app.userInfo.nickName,
            logined:true
          });
        });
      }).catch((err)=>{
        console.log('添加执行失败');
        console.log(err);
      });
    } 
  },
  /* 登录方法 */
  getMessage(){
    db.collection('message').where({
      userId: app.userInfo._id
    }).watch({//数据消息监听
      onChange: function(snapshot) {
        // console.log(snapshot)
        if(snapshot.docChanges.length){
          let list = snapshot.docChanges[0].doc.list;
          if(list.length){
            wx.showTabBarRedDot({
              index : 2
            });
            app.userMessage = list;
          }else{
            wx.hideTabBarRedDot({
              index: 2,
            })
            app.userMessage = [];
          }
        }
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    });
  }
})