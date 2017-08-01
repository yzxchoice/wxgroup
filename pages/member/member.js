// member.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupid: 0,
    group: {},
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getGroupDetail(options.groupid, 0);
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

  getGroupDetail: function (groupid, pageindex) {
    var that = this;
    wx.request({
      url: util.config.prefix + 'group/getgroupdetail',
      data: {
        groupid: groupid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data[0]);
        that.setData({
          group: res.data
        })

        wx.getStorage({
          key: 'openid',
          success: function (store) {
            console.log(store.data)
            that.setData({
              openid: store.data
            })

            var m = false;
            res.data.member.forEach(function (item) {
              if (item.open_id === store.data) {
                m = true
              }
            })
          }
        })
      }
    })
  }
})