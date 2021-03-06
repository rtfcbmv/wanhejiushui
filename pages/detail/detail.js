// pages/detail/detail.js
var app = getApp()
function fomatFloat(src, pos) {
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}
Page({
  data:{
    orderindex:-1,
    cartlength:0,
    goodsinfo:{},
    goodswiper:[],
    goodimg:[],
    num:0,
    imgRoute: '',
    imgshow:false,
    theimg:'',
    evaluate: {},
    Disclaimer: '对于外地用户,不满一箱的商品，其运费将按照整箱计算，欢迎整箱购买。',

    },
  showimg:function(e){
    console.log(e)
    this.setData({
      theimg: e.currentTarget.dataset.img,
      imgshow: true,
    })
  },
  backtopage:function () {
    this.setData({
      theimg: '',
      imgshow: false,
    })
  },
  numreduce:function(){
    if (this.data.num>0)
      this.setData({
          num: this.data.num-1
      })
  },
  numincrease:function(){
    this.setData({
        num: this.data.num+1
    })
  },
  gotopraise:function(){
    wx.navigateTo({
      url: '../praise/praise?id=' + this.data.goodsinfo.goods_id,
    })
  },
  gotocart:function(){
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  buynow:function(){
    var that =this
    if (this.data.num > 0)
    {
      var amount = that.data.goodsinfo.price * that.data.num
      amount = fomatFloat(amount, 3)
      wx.setStorage({
        key: 'ordersummit',
        data: {
          "amount": amount,
          "goodssubmmit": [
            {
              "goods_id": this.data.goodsinfo.goods_id,
              "goods_num": that.data.num
            }
          ],
          "orderlist": [
            {
              "goods_id": this.data.goodsinfo.goods_id,
              "name": this.data.goodsinfo.name,
              "price": this.data.goodsinfo.price,
              "img": this.data.goodsinfo.img,
              "num": that.data.num,
              "edit": 1
            }
          ]
        },
      })
      wx.redirectTo({
        url: '../settlement/settlement?style=1',
      })
    }
    else{
      wx.showToast({
        mask: 'True',
        title: '请选择商品数量',
        image: '../../images/tip.png',
        duration: 1200
      })
    }
  },
  addtocart:function(){
    var theorder={} 
    if (this.data.orderindex < 0 && this.data.num>0)
    { 
      theorder.goods_id = this.data.goodsinfo.goods_id
      theorder.name = this.data.goodsinfo.name
      theorder.price = this.data.goodsinfo.price
      theorder.img = this.data.goodsinfo.img
      theorder.num = this.data.num
      theorder.edit = 1
      this.setData({
        orderindex: app.data.orderlist.length
      })
      app.data.orderlist.push(theorder)
      wx.showToast({
        title: '已添加到购物车',
        duration: 1200
      })
      this.setData({
        cartlength: app.data.orderlist.length
      })

    }
    else if (this.data.orderindex >= 0 && this.data.num > 0)
    {
      app.data.orderlist[this.data.orderindex].num = this.data.num
      wx.showToast({
        title: '已更新该商品数量',
        duration: 1200
      })
    }
    else
    {
      wx.showToast({
        mask:true,
        title: '请选择商品数量',
        image:'../../images/tip.png',
        duration:1000
      })
    }
    console.log(app.data.orderlist)
 },

  onLoad:function(){
    var that=this;
    that.setData({
      imgRoute: app.data.imgRoute
    })
    wx.getStorage({
      key: 'selectedgoods',
      success: function(res) {
        that.setData({
          goodsinfo:res.data,
        })
        for (var i = 0; i < app.data.orderlist.length; i++)
        {
          if (app.data.orderlist[i].goods_id == res.data.goods_id)
          {
            that.setData({
              orderindex:i,
              num: app.data.orderlist[i].num
            })
            break
          }
        }
        console.log(that.data.goodsinfo.goods_id)
        wx.request({
          url: app.data.imgRoute+'/shop/show_goods_detail/',
          data: {
            goods_id: that.data.goodsinfo.goods_id
          },
          success: function(resu) {
            console.log(resu)

            that.setData({
              evaluate: resu.data.infos.comment,
                goodswiper: resu.data.infos.img_list,
                goodimg:resu.data.infos.detail_list
            })
          }
        })
      },
    })
    this.setData({
      cartlength: app.data.orderlist.length
    })
   
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})