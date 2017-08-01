// album.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist: [],
    prefix: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.groupid);
    this.getImages(options.groupid)
    this.setData({
      prefix: util.config.prefix + 'pic/'
    })
  },

  showBig: function(e){
    console.log(e.target.dataset.name);
    var img = e.target.dataset.name;
    wx.previewImage({
      urls: [this.data.prefix + img.img_path] // 需要预览的图片http链接列表
    })
  },

  getImages: function (groupid) {
    var that = this;
    wx.request({
      url: util.config.prefix + 'group/getalbum',
      data: {
        groupid: groupid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var temp = res.data;
        temp.forEach(function(item){
          
        });
        that.setData({
          imglist: res.data
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