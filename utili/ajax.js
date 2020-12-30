/* 
  封装代码，一般要么暴露数据要么暴露方法
  封装代码核心思想：
    保留公共部分，提取动态传入部分
    封装函数：
      1.保留公共部分（重复出现的代码，比如wx.request(options对象)）
      2.提取动态传入部分（）、
      3.谁调用谁传入
 */


export default function(url,data={},method="GET"){  
  return new Promise((resolve,reject) => {
    let cookieStr = wx.getStorageSync("cookies")
    let cookies = []
    if (cookieStr) {
      cookies = JSON.parse(cookieStr)
    }
    wx.request({
      url: "https://wangyiyinyue.cn1.utools.club" + url,
      // url: 'http://localhost:3000' + url,
      data,
      method,
      header:{
        cookie: Array.prototype.toString.call(cookies)
      },
      success: (res) => {
        
        if(data.isLogin){
         let arr = res.cookies.filter(item=>{
           return item.indexOf("MUSIC_U") === 0
         })
          wx.setStorage({
            key: 'cookies',
            data: JSON.stringify(arr),
          })
        }
        resolve(res.data)
      }
    })
})
}





