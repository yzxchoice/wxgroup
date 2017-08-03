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
    groupid: 0,
    inGroup: false,
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.groupid);
    
    this.setData({
      prefix: util.config.videoprefix + 'videos/',
      groupid: options.groupid
    })
    this.getImages(options.groupid, 0)
    this.getGroupDetail(options.groupid, 0);
  },

  showBig: function (e) {
    console.log(e.target.dataset.name);
    var img = e.target.dataset.name;
    // wx.previewImage({
    //   urls: [this.data.prefix + img.video_path] // 需要预览的图片http链接列表
    // })
  },

  getImages: function (groupid, pageindex) {
    var that = this;
    if (pageindex === 0) {
      that.setData({
        imglist: []
      })
    }
    wx.request({
      url: util.config.prefix + 'group/getvideos',
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
        that.setData({
          imglist: that.data.imglist.concat(res.data),
          pageindex: pageindex
        })
      }
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

  addVideo: function (e) {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        var tempFilePath = res.tempFilePath
        console.log(tempFilePath);
        wx.showToast({
          title: '上传中……',
          icon: 'loading',
          duration: 3000
        });
        wx.uploadFile({
          url: util.config.prefix + 'group/addvideo',
          filePath: tempFilePath,
          name: 'file',
          formData: {
            'groupid': that.data.groupid,
            'openid': that.data.openid
          },
          success: function (res) {
            var data = res.data
            //do something
            console.log(data);
            that.getImages(that.data.groupid, 0)
            wx.hideToast();
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
    var that = this;
    if (!that.data.noresult) {
      that.getImages(that.data.groupid, that.data.pageindex)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})