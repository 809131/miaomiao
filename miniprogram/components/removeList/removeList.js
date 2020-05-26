// components/removeList/removeList.js

const app = getApp()
const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageId:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    userMessage: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDelMessage(){
      wx.showModal({
        title:'提示信息',
        content:'删除消息',
        confirmText:'删除',
        sccuess(res){
          if (res.confirm) {
            db.collection('message').where({
              userId : app.userInfo._id
            }).get().then((res)=>{
              let list = res.data[0].list;
              list.filter((val,i)=>{
                return val != this.data.messageId
              });
              // 更新云函数
              wx.cloud.collection({
                name:'updata',
                data:{
                  collection:'message',
                  where:{
                    userId: app.userInfo._id
                  },
                  data:{
                    list
                  }
                }

              }).then((res)=>{
                this.triggerEvent('myevent', list)
              });
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  lifetimes: {
    attached: function(){
      db.collection('users').doc(this.data.messageId)
        .field({
          userPhote: true,
          nickName: true
        }).get().then((res)=>{
        this.setData({
          userMessage: res.data
        
        })
      });
    }
  }
})
