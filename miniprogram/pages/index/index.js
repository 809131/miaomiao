// pages/index/index.js

const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img3.imgtn.bdimg.com/it/u=2468618547,2163415948&fm=26&gp=0.jpg', 
      'http://5b0988e595225.cdn.sohucs.com/images/20170914/5f52ebf58bad422799c26dbe7fc7e19b.jpeg', 
      'http://img3.redocn.com/20100529/Redocn_2010052600261600.jpg',
      'http://img0.imgtn.bdimg.com/it/u=2477583491,2689561307&fm=26&gp=0.jpg'
    ],
    listData:[],
    current :'links'
  },
  // 推荐最新两个页面间的切换
  handleCurrent(e){
    // console.log(e)
    let current = e.target.dataset.current;
    if(current == this.data.current){
      return false;
    }
    this.setData({
      current
    },()=>{
      this.getListData();
    });
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
    this.getListData();
    
  },

  handleLinks(e){
    let id = e.target.dataset.id;
    // 调用云函数****************
    wx.cloud.callFunction({
      name:'updata',
      data:{
        collection:'users',
        doc:id,
        data:"{links : _.inc(1)}"  //前端出入字符串到服务端进行解析  _.inc(1)表示每次点击+1(数据库)
      }
    }).then((res)=>{
      // console.log(res)
      let updated = res.result.stats.updated;
      if(updated){
        // 克隆一份数据进行循环
        let cloneListData = [...this.data.listData];
        for(let i=0;i<cloneListData.length;i++){
          // 将cloneListData._id与传回来的id进行比较
          if(cloneListData[i]._id == id){
            cloneListData[i].links++;
          }
        }
        this.setData({
          listData : cloneListData
        });
      }
      
    });
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
  getListData(){
    // 出发数据库，读取数据*************
    // .field({属性名：true})  将需要用到的属性名和属性值读取回来，不需要的就不用读取
    db.collection('users')
    .field({
      userPhote : true,
      nickName : true,
      links : true
    })
    .orderBy(this.data.current, 'desc')
    .get()
    .then((res)=>{
      // console.log(res.data)
      this.setData({
        listData : res.data
      });
    });
  },

  // 点击图片进入详情页
  handleDetail(e){
    // console.log(e)
    let id = e.target.dataset.id;
    // 页面跳转
    wx.navigateTo({
      url: '/pages/detail/detail?userId=' + id,
    })
  },
})