import ajax from "../../utili/ajax.js"

Page({
  data: {
    banner:[],
    result:[],
    // 推荐歌曲只显示6个
    num:6,
    topList:[],
  },
  
  onLoad: function () {
    
   // 请求轮播图
   // 因为那边使用的是promise，所以返回的是一个primise对象，用then来接收成功的回调
   let promise1 = ajax(`/banner`,{type:2});
   promise1.then((result)=>{
    //  console.log(result)
     this.setData({
       banner:result.banners
     })
   })
    
    // 请求推荐歌曲数据
    let promise2 = ajax(`/personalized`)
    promise2.then(result=>{
      // console.log(result)
      this.setData({
        result:result.result
      })
    })

    let arr = [1,2,3]
    let index = 0
    let topList = []
    while(index < arr.length){
      let promise3 = ajax("/top/list",{idx:arr[index++]})
      // console.log(promise3)
      promise3.then(result=>{
        // console.log(result)
        let obj = {
          name:result.playlist.name,
          list: result.playlist.tracks,
          // userName: result.playlist.tracks.map((ar) => {
          //   return ar.ar.map((ar) => ar.name)
          // })
        }
        topList.push(obj)
        // console.log(List)

        this.setData({
          topList
        })
      })
    }
  },

    toRecommendSong() {
      wx.navigateTo({
        url: '/songs/pages/recommendSong/recommendSong',
      })
    }
})
