// pages/personal/personal.js
import ajax from "../../utili/ajax.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moveDistance:0,
    moveTransition:"",
    userInfo:{},
    playList:[]
  },

  // 手指按下触发的事件
  Tochstart(event) {
    // console.log(event.touches[0])
    // 收集当前手指按下的位置
    this.startY = event.touches[0].clientY;
    // 按下的时候清空，回到开始的位置
    this.setData({
      moveTransition:''
    })
  },

  // 手指移动时触发的事件
  Touchmove(event) {
    // console.log(event.touches[0])
    // 收集手指移动的位置
    let moveY = event.touches[0].clientY;
    // 往下滑动的距离 = 移动的位置 - 按下的位置
    let moveDistance = Math.floor(moveY - this.startY)

    /* 
      当移动距离为负数时（就是向上移动）时，不做处理，
      当移动距离超出80rpx时（就是向下移动），不做处理
     */
    if (moveDistance < 0 || moveDistance>80) return

    this.setData({
      moveDistance
    })
  },

  // 手指触摸结束事件
  Touchend() {
    // 以1秒的速度回到初始的位置
    this.setData({
      moveDistance:0,
      moveTransition:"transform 1000ms"
    })
  },

  // 跳转到登录页面
  tologin() {
    if (this.data.userInfo.userId) return
    wx.navigateTo({
      url:"/pages/login/login"
    })
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
  onShow: function () {
    let userInfo = wx.getStorageSync("userInfo")
    if (userInfo){
      userInfo = JSON.parse(userInfo)
      this.setData({
        userInfo
      })
    let promise2 = ajax(`/user/record`,{
        uid: userInfo.userId,
        type : 1
      }).then((result)=>{
        // console.log(result)
       let playList = result.weekData.map((item)=>item.song)
        this.setData({
          playList
        })
      })
    }
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