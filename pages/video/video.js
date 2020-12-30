// pages/video/video.js
import ajax from "../../utili/ajax.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupList:[],
    id:null,
    videoList:[],
    // triggered: false,
    scrollId:"",
    vidId:""
  },

  // 更新点击的id
 async hanlescroll(event) {
    // console.log(event.target.dataset.id)
   let { id } = event.target.dataset
   let scrollId = event.target.id
  //  console.log(scrollId)
    // 收集点击的id，更新数据
    this.setData({
      id,
      scrollId
    })

      /* 
        1.请求当前id最新数据
        2.弹出加载中的弹窗
        3.数据没回来期间将列表重置为空（将videoList数组清空）
       */

      wx.showLoading({
        title: "加载中..."
      })

      this.setData({
        videoList:[]
      })

      await this.getVideoList();
      // console.log(1)
      wx.hideLoading()
    
  },

  // 专门用于请求videoList数据
  async getVideoList() {
    let videoListData = await ajax('/video/group', {
      id: this.data.id
    })
    // console.log(videoListData)
    let videoList = videoListData.datas.map((item) => {
      return item.data
    })
    // console.log(2)
    this.setData({
      videoList
    })
  }, 

  // 下拉刷新，更新当前数据
 async handlePullDowm() {
     await this.getVideoList();
      this.setData({
        triggered:false
      })
  },

  // 上拉触底时，加载更多
  handleScrollToLowe() {
    // 简单节流
    // 如果正在发送请求，直接return出去
    if(this.flag) return
    this.flag = true
    // 发送请求
    setTimeout(()=>{
      let data = JSON.parse(JSON.stringify(this.data.videoList))
      // console.log(data)
      this.setData({
        videoList: [...this.data.videoList, ...data]
      })
      // console.log(111)
      this.flag = false
    },3000)
  },

  handleVideo(event) {
    let { id } = event.currentTarget
    this.setData({
      vidId:id
    })
    let videoContext = wx.createVideoContext(id)
    videoContext.play()
  },

  handlePlay(event) {
    // console.log(event.target.id)
    let oldVid = this.oldVid
    let {id} = event.currentTarget
    // console.log(oldVid,id)
    if (oldVid && oldVid != id) {
      let videoContext = wx.createVideoContext(oldVid)
      videoContext.pause()
    }
    this.oldVid = id
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    let cookies = wx.getStorageSync("cookies")
    // console.log("cookies:",cookies)
    // 如果当前用户没有登录，则弹出提示框
      if(!cookies){
        wx.showModal({
          title: '请先登录',
          content: '该功能需要登录才能使用',
          cancelText:"回到首页",
          confirmText:"去登录",
          success: ({ confirm})=>{
            if(confirm){
              wx.redirectTo({
                url: '/pages/login/login',
              })
            }else{
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          }
        })
        return;
      }
    
    // 获取视频标签列表
    let result = await ajax("/video/group/list");
    // console.log('result', result)
    let groupList = result.data.slice(0, 14);
    this.setData({
      groupList,
      id: groupList[0].id
    })
    this.getVideoList();
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
  onShareAppMessage: function ({from,target}) {
    // console.log(from, target)
    if (from === "button"){
      return {
        title:target.dataset.title,
        path:"/pages/video/video",
        imageUrl: target.dataset.imageurl,
      }
    }else if(from === "menu"){
      return {
        title: "网易云音乐",
        path: "/pages/index/index",
        imageUrl: "/static/images/logo.png"
      }
    }
  }
})