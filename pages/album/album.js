// album.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist: [],
    prefix: '',
    pageindex: 0,
    noresult: false,
    groupid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.groupid);
    this.setData({
      prefix: util.config.prefix + 'pic/',
      groupid: options.groupid
    })
    this.getImages(options.groupid, 0)
    
  },

  showBig: function(e){
    console.log(e.target.dataset.name);
    var that = this;
    var img = e.target.dataset.name;
    var temp = [];
    img.imgpatharray.forEach(function (item) {
      temp.push(that.data.prefix + item)
    })
    wx.previewImage({
      urls: temp // 需要预览的图片http链接列表
    })
  },

  getImages: function (groupid, pageindex) {
    var that = this;
    wx.request({
      url: util.config.prefix + 'group/getalbum',
      data: {
        groupid: groupid,
        pageindex: pageindex
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
        pageindex++;
        var temp = res.data;
        temp.forEach(function(item){
          
        });
        that.setData({
          imglist: that.data.imglist.concat(res.data),
          pageindex: pageindex
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
    var that = this;
    if (!that.data.noresult){
      that.getImages(that.data.groupid, that.data.pageindex)
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})