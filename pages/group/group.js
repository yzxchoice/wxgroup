var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    loading: false,
    group:{},
    inGroup: false,
    groupid: 0 ,
    openid: '',
    animationData: {},
    isMask: false,
    userInfo: {},
    imgprefix: '',
    videoprefix: '',
    showbar: false,
    pageindex: 0,
    activelist: [],
    noresult: false,
    ispreview: false,
    imgtoken: ''
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.userInfo.nickName + '邀请你加入群组',
      path: '/pages/group/group?groupid=' + this.data.groupid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onShow: function(){
    // if (!this.data.ispreview){
    //   this.getGroupDetail(this.data.groupid, 0);
    // }
    // this.setData({
    //   ispreview: false
    // })
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
    this.setData({
      imgprefix: util.config.prefix + 'pic/',
      videoprefix: util.config.prefix + 'videos/',
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      //更新数据
      that.setData({
        userInfo: userInfo
      })

    })
    
  },
  showUsers: function(e){
    wx.navigateTo({
      url: '../member/member?groupid=' + this.data.groupid
    })
  },
  showBig: function (e) {
    console.log(e.target.dataset.name);
    var that = this;
    this.setData({
      ispreview: true
    })
    var img = e.target.dataset.name;
    var temp = [];
    img.imgpatharray.forEach(function(item){
      temp.push(that.data.imgprefix + item)
    })
    wx.previewImage({
      urls: temp // 需要预览的图片http链接列表
    })
  },

  showSingleBig: function (e) {
    console.log(e.target.dataset.name);
    var that = this;
    this.setData({
      ispreview: true
    })
    var img = e.target.dataset.name;
    wx.previewImage({
      urls: [that.data.imgprefix + img.img_path] // 需要预览的图片http链接列表
    })
  },
  getGroupDetail: function (groupid, pageindex) {
    var that = this;
    
    if(that.data.loading){
      return;
    }
    if(pageindex === 0){
      that.setData({
        activelist: []
      })
    }
    that.setData({
      loading: true
    })
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
        if (res.data.activelist.length < 10){
          that.setData({
            noresult: true
          })
        }
        pageindex++;
        that.setData({
          group: res.data,
          activelist: that.data.activelist.concat(res.data.activelist),
          pageindex: pageindex,
          loading: false
        })
        //下拉刷新完成
        // wx.stopPullDownRefresh();

        wx.getStorage({
          key: 'openid',
          success: function (store) {
            console.log(store.data)
            that.setData({
              openid: store.data
            })
            
            var m = false;
            res.data.member.forEach(function(item){
              if(item.open_id === store.data){
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
  addActive: function(e){
    console.log(e);
    this.hideButtonBar();
    wx.navigateTo({
      url: '../active/active?groupid=' + this.data.groupid
    })
  },
  hideButtonBar: function (){
    var that = this;
    this.setData({
      isMask: false,
      showbar: false
    })
    /*文本显示动画*/
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })

    that.animation = animation

    animation.opacity(0).step();

    that.setData({
      animationData: animation.export()
    })
  },
  addVideo: function(e){
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
            that.hideButtonBar();
            that.getGroupDetail(that.data.groupid, 0);
            wx.hideToast();
          }
        })
      }
    })
  },
  addImage: function(e){
    var that = this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0]);
        var filenum = tempFilePaths.length;
        var fileindex = 1;
        wx.showToast({
          title: '上传中……',
          icon: 'loading',
          duration: 3000
        });
        wx.uploadFile({
          url: util.config.prefix + 'group/addimage',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'groupid': that.data.groupid,
            'openid': that.data.openid,
            'imgtoken': that.data.imgtoken
          },
          success: function (res) {
            var data = res.data
            if (filenum === 1){
              that.hideButtonBar();
              that.getGroupDetail(that.data.groupid, 0);
              wx.hideToast();
              return;
            }
            tempFilePaths.shift();
            fileindex ++;
            tempFilePaths.forEach(function (file, i) {
              wx.uploadFile({
                url: util.config.prefix + 'group/addimage',
                filePath: file,
                name: 'file',
                formData: {
                  'groupid': that.data.groupid,
                  'openid': that.data.openid,
                  'imgtoken': that.data.imgtoken
                },
                success: function (res) {
                  var data = res.data
                  console.log(data);
                  fileindex++;
                  that.hideButtonBar();
                  if (fileindex >= filenum){
                    that.getGroupDetail(that.data.groupid, 0);
                  }
                  
                  wx.hideToast();
                }
              })
            })
          }
        })
        
        
      }
    })
  },
  joinGroup: function(e){
    var that = this;
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
              wx.request({
                url: util.config.prefix + 'user/adduser',
                data: {
                  user_id: 1,
                  open_id: res.data.openid,
                  username: that.data.userInfo.nickName,
                  image_path: that.data.userInfo.avatarUrl
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                success: function (addres) {
                  wx.request({
                    url: util.config.prefix + 'group/joingroup',
                    data: {
                      openid: res.data.openid,
                      groupid: that.data.groupid,
                      username: that.data.userInfo.nickName,
                      image_path: that.data.userInfo.avatarUrl
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    success: function (res) {
                      console.log(res.data)
                      that.getGroupDetail(that.data.groupid, 0);

                    }
                  })
                }
              })

            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });

  },
  hideMask: function(){
    var that = this;
    this.setData({
      isMask: false
    })
    /*文本显示动画*/
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })

    that.animation = animation

    animation.opacity(0).step();

    that.setData({
      animationData: animation.export()
    })
  },
  showBtnbar: function(){
    var that = this;
    var imgtoken = that.data.openid + Date.parse(new Date())/1000;
    console.log(imgtoken);
    this.setData({
      isMask: true,
      showbar: true,
      imgtoken: imgtoken
    })
    /*文本显示动画*/
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })

    that.animation = animation

    animation.opacity(1).step();

    that.setData({
      animationData: animation.export()
    })
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    console.log('到底了');
    var that = this;
    if (!that.data.noresult) {
      that.getGroupDetail(that.data.groupid, that.data.pageindex)
    }
    
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('下拉动作');
    var that = this;
    //下拉刷新数据
    that.getGroupDetail(that.data.groupid, 0);
    // "enablePullDownRefresh": true
  }
})