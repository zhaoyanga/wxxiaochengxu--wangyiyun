// components/navHeader/navHeader.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String
    },
    content:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击更多跳转到更多界面
    hanleclick() {
      // console.log(this.properties)
      if (this.properties.title === "推荐歌曲"){
        wx.navigateTo({
        url: "/pages/more/more"
      })
      }
    },
  }
})
