//index.js
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    openid: '',
    grouplist: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function(){
    console.log(this.data.openid);
    // this.getGroups(this.data.openid)
  },
  addUser: function (openid) {
    console.log(openid);
    wx.request({
      url: util.config.prefix + 'user/adduser',
      data: {
        user_id: 1,
        open_id: openid,
        username: this.data.userInfo.nickName,
        image_path: this.data.userInfo.avatarUrl
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        wx.setStorage({
          key: "userid",
          data: res.data.userDetail.id
        })
      }
    })
  },
  getGroups: function(openid){
    var that = this;
    wx.request({
      url: util.config.prefix + 'group/groups',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        that.setData({
          grouplist:res.data
        })
      }
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      //更新数据
      that.setData({
        userInfo: userInfo
      })

    })


    // wx.checkSession({
    //   success: function (res) {
    //     //session 未过期，并且在本生命周期一直有效
    //     console.log(res);
    //     wx.getStorage({
    //       key: 'openid',
    //       success: function (res) {
    //         console.log(res.data)
    //         that.setData({
    //           openid: res.data
    //         })
    //         that.addUser(res.data);
    //       }
    //     })

    //   },
    //   fail: function () {
        
    //   }
    // })

    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res.code);
          //发起网络请求
          wx.request({
            url: util.config.prefix + 'user/getopenid',
            data: {
              jscode: res.code
            },
            method: 'POST',
            success: function (res) {
              console.log(res.data)
              wx.setStorage({
                key: "openid",
                data: res.data.openid
              })
              that.setData({
                openid: res.data.openid
              })
              that.addUser(res.data.openid);
              that.getGroups(res.data.openid)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });

  }
})
