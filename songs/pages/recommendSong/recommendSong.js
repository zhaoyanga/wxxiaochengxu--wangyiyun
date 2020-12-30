import ajax from "../../../utili/ajax.js"
import PubSub from "pubsub-js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:"",
    month:"",
    recommend:[],
    currentIndex:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    let day = new Date().getDate()
    let month = new Date().getMonth() + 1
    this.setData({
      day,
      month
    })
    let cookies = wx.getStorageSync("cookies")
    // 如果当前用户没有登录，则弹出提示框
    if (!cookies) {
      wx.showModal({
        title: '请先登录',
        content: '该功能需要登录才能使用',
        cancelText: "回到首页",
        confirmText: "去登录",
        success: ({ confirm }) => {
          if (confirm) {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          } else {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
      return;
    }
    let {recommend} = await ajax('/recommend/songs')
    // console.log(recommend)
    this.setData({
      recommend:recommend
    })
  },

  toSong(event) {
    // console.log(event)
    let { id,index } = event.currentTarget.dataset
    this.setData({
      currentIndex:index
    })
    PubSub.subscribe("switchType",(msg,data)=>{
      // console.log(msg,data)
      let { currentIndex, recommend } = this.data
      if (data === "next") {
        if (currentIndex === recommend.length - 1){
          currentIndex = 0
        }else{
          currentIndex ++
        }
      }
      if (data === "pre"){
        if (currentIndex === 0) {
          currentIndex = recommend.length - 1
        } else {
          currentIndex --
        }
      }
      let ids = recommend[currentIndex].id
      this.setData({
        currentIndex
      })
      PubSub.publish('changeId', ids)
    })
    wx.navigateTo({
      url: `/songs/pages/song/song?ids=` + id,
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