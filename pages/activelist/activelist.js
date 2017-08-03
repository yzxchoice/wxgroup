// activelist.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activelist: [],
    groupid: 0,
    openid: '',
    noresult: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.groupid);
    this.setData({
      groupid: options.groupid
    })
    this.getActives(options.groupid)
    this.getGroupDetail(options.groupid, 0);
  },

  getActives: function (groupid) {
    var that = this;
    wx.request({
      url: util.config.prefix + 'group/getactives',
      data: {
        groupid: groupid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.length < 10) {
          that.setData({
            noresult: true
          })
        }
        that.setData({
          activelist: res.data
        })
      }
    })
  },

  addActive: function (e) {
    wx.navigateTo({
      url: '../active/active?groupid=' + this.data.groupid
    })
  },

  getGroupDetail: function (groupid, pageindex) {
    var that = this;

    wx.request({
      url: util.config.prefix + 'group/getgroupdetail',
      data: {
        groupid: groupid,
        pageindex: pageindex
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success: function (res) {

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
            console.log(m);
            that.setData({
              inGroup: m
            })
          }
        })
      }
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
  
  }
})