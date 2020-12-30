// pages/login/login.js
import ajax from "../../utili/ajax.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    password:"",
    item:{}
  },

  // 收集用户输入的手机号和密码
  heandlchange(event) {
    // console.log(event)
    let type = event.currentTarget.dataset.type
    this.setData({
      // []解析变量，原本是个字符串
      [type]:event.detail.value
    })
  },

  // 点击登录
  login() {
    let phone = this.data.phone
    let password = this.data.password
    
    
    // if (!phone || !password) return
    if(!phone){
      wx:wx.showToast({
        title: '请输入手机号',
        icon: 'none',
      })
      return
    }
    if(!password){
      wx: wx.showToast({
        title: '请输入密码',
        icon: 'none',
      })
      return
    }
    wx.showLoading({
      title: "登入成功，请稍后"
    })
    let promise1 = ajax(`/login/cellphone`, { phone, password,isLogin:true })
      promise1.then((result) => {
        // console.log(result)
        if (result.code === 400){
          wx: wx.showToast({
            title: '手机号错误',
            icon: 'none',
          })
          return
        }
        if(result.code === 502){
          wx: wx.showToast({
            title: '密码错误',
            icon: 'none',
          })
          return
        }
        wx.setStorage({
          key:"userInfo",
          data: JSON.stringify(result.profile)
        })
        wx.switchTab({
          url: '/pages/personal/personal',
        })
        wx.hideLoading()
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