// active.js
var util = require('../../utils/util.js')
Page({

  formSubmit: function (e) {
    var that = this
    if(!e.detail.value.inputtitle){
      wx.showToast({
        title: '请填写标题',
        icon: 'warning',
        duration: 2000
      })
      return
    }
    if (!that.data.date) {
      wx.showToast({
        title: '请选择日期',
        icon: 'warning',
        duration: 2000
      })
      return
    }
    if (!e.detail.value.inputaddress) {
      wx.showToast({
        title: '请选择地址',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (!e.detail.value.inputdes) {
      wx.showToast({
        title: '请填写介绍',
        icon: 'error',
        duration: 2000
      })
      return
    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.showToast({
      title: '加载中……',
      icon: 'loading',
      duration: 3000
    });
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log(res.data)
        that.setData({
          openid: res.data
        })
        wx.request({
          url: util.config.prefix + 'group/addactive',
          data: {
            openid: res.data,
            title: e.detail.value.inputtitle,
            time: that.data.date + ' ' + that.data.time,
            address: e.detail.value.inputaddress,
            description: e.detail.value.inputdes,
            groupid: that.data.groupid
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            console.log(res.data)
            wx.hideToast();
            wx.redirectTo({
              url: '../activelist/activelist?groupid=' + that.data.groupid
            })
          }
        })
      }
    })

  },
  formReset: function () {
    console.log('form发生了reset事件')
  },

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    time: '',
    address:'',
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    groupid: 0 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      groupid: options.groupid
    })
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

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },

  chooseLocation: function(e){
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        var latitude = res.latitude
        var longitude = res.longitude
        var name = res.name
        var address = res.address
        that.setData({
          address: address
        })
      }
    })
  }
})