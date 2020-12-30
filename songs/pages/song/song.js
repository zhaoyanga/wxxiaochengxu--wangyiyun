// pages/song/song.js
import ajax from "../../../utili/ajax.js"
import PubSub from "pubsub-js"
import dayjs from "dayjs"
let appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ids:null, // 歌曲的id
    songs:{}, // 歌曲的详细信息
    isSong:false, // 用来判断歌曲是播放还是暂停
    musicUrl:"",  // 音频的地址
    duration: "00:00", // 结束的时间
    currentWidth:0, // 进度条的进度
    currentTime: "00:00" // 开始的时间 
  },

  // 专门用于绑定背景音频的监听
  addEvent(){
    // 进度条和歌曲总时长效果
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = this.backgroundAudioManager.currentTime
      let duration = this.backgroundAudioManager.duration
      let currentWidth = currentTime / duration * 100
      this.setData({
        currentWidth,
        currentTime: dayjs(currentTime * 1000).format("mm:ss")
      })
    })

    // 播放状态
    this.backgroundAudioManager.onPlay(()=>{
      this.setData({
        isSong: true
      })
      appInstance.globalData.isSong = true
    })

    // 暂停状态
    this.backgroundAudioManager.onPause(()=>{
      this.setData({
        isSong:false
      })
      appInstance.globalData.isSong = false
    })

    // 自动切换下一首
    this.backgroundAudioManager.onEnded(()=>{
      // console.log("1111")
      PubSub.publish('switchType', "next")
    })

  },

// 获取歌曲详细信息
 async getMusic(ids) {
   ids = ids ? ids : this.data.ids
    let result = await ajax("/song/detail", {
      ids: ids
    })
    // console.log(result)
    // 把歌曲信息更新到data中
    this.setData({
      songs: result.songs[0],
      ids,
      duration: dayjs(result.songs[0].dt).format("mm:ss")
    })
   
    // 设置导航栏名字为当前歌曲的名字
    wx.setNavigationBarTitle({
      title: this.data.songs.name,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取上一个界面点击进来的歌曲id
    
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    let { ids } = options
    // 更新到data中
    this.setData({
      ids:ids
    })
    this.getMusic(ids)
    // 获取缓存好的上一首的播放状态和id
    let { isSong, audio} = appInstance.globalData;
    // 比较当前歌曲和上一首歌是不是同一首歌
    if (isSong && audio === ids){
      this.setData({
        isSong:true
      })
    }

    PubSub.subscribe("changeId",async (msg, data) => {
      // console.log('changeId', data)
      this.setData({
        ids: data
      })
      this.getMusic(data)
      await this.getMuiscUrl()
      this.backgroundAudioManager.src = this.data.musicUrl
      this.backgroundAudioManager.title = this.data.songs.name
    })
    this.addEvent()
  },

  switchType(event) {
    // console.log(event)
    let { id } = event.currentTarget
    PubSub.publish('switchType', id)
  },

  // 用于请求当前歌曲Url
  async getMuiscUrl(){
    let MusicUrl = await ajax("/song/url", {
      id: this.data.ids
    })
    this.setData({
      musicUrl: MusicUrl.data[0].url
    })
  },

  async handlePlay() {
   // 判断之前有没有Url，没有就获取播放地址，更新到data中
   if (!this.data.musicUrl){
    await this.getMuiscUrl()
   }
  // 调用getBackgroundAudioManager返回一个实例，这是背景音乐
  // let backgroundAudioManager = wx.getBackgroundAudioManager()
  // 判断isSong是true还是false
  // 是true就是在播放状态，点击后，暂停音乐，把isSong改成false
   if (this.data.isSong){
     this.backgroundAudioManager.pause();
     // 一进来就停止播放音乐,点击按钮暂停
     this.setData({
       isSong: false
     })
     // 暂停则改为false
     appInstance.globalData.isSong = false
   }else{
     // 再次点击就是播放 添加src属性和title，开启后台播放
     this.backgroundAudioManager.src = this.data.musicUrl
     this.backgroundAudioManager.title = this.data.songs.name
    //  this.backgroundAudioManager.startTime = 150
     this.setData({
       isSong: true
     })
     // 播放的时候把isSong缓存设为 true  audio为当前歌曲id
     appInstance.globalData.isSong = true
     appInstance.globalData.audio = this.data.ids
   }
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