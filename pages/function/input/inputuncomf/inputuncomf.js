// pages/input/inputuncomf/inputuncomf.js
var util = require('../../../../utils/util.js');
import { vicoDiscomfortCommit ,vicoDiscomfortDelete } from "../../../../utils/config";
import { tokenRequest } from "../../../../utils/Request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: util.formatTime2(new Date()),
    time: util.formatTime4(new Date()),
    happenDateTime:'',
    serialNo:0,
    feature:0,
    discomfort: '',
    memo: "",

    uncomfArr: ["剧烈头痛", "恶心呕吐", "胸痛", "四肢麻木无力", "语言不清"],
    event:{},
    commitStatus : true,
  },

  bindSwitchChange:function(e){
    let id = e.currentTarget.dataset.id
    let weight = Math.pow(2,id)
    let uncomfArr = this.data.uncomfArr
    let feature = parseInt(this.data.feature)
    this.setData({
      feature: e.detail.value? feature+ weight:feature - weight,
      discomfort:e.detail.value?this.data.discomfort.concat(uncomfArr[id] + ','):this.data.discomfort.replace(uncomfArr[id] + ',','')
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      happenDateTime:e.detail.value + " " + this.data.time + ":00"
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value,
      happenDateTime: this.data.date + " " + e.detail.value + ":00"
    })
  },
  bindInputCom: function (e) {
    this.setData({
      memo: e.detail.value
    })
  },

  /**
   *  数据校验
   */
  inputValidate: function () {
    var feature = this.data.feature;
    if (feature <= 0) {
      wx.showToast({
        title: "请输入不适情况",
        icon: "none"
      });
      return 1
    }
    return 0
  },
  
  /**
   *  status 新增0 修改 删除255
   */
  dataManager: function(e) {
    var that = this;
    this.setData({
      event:e
    })
    let status = e.currentTarget.dataset.status
    let data,url
    //检查数据
    if(this.inputValidate()){
      return false
    }
    //set status
    if(status == 255){
      data = {
        serialNo: parseInt(this.data.serialNo),
      }
      url = vicoDiscomfortDelete
    }else if(status == 254){
      data = {
        happenDateTime: this.data.happenDateTime,
        serialNo: parseInt(this.data.serialNo),
        memo: this.data.memo,
        discomfort:this.data.discomfort.slice(0,-1),
      }
      url = vicoDiscomfortCommit

    }else{
      data = {
        happenDateTime: this.data.happenDateTime,
        memo: this.data.memo,
        discomfort:this.data.discomfort.slice(0,-1),
        status: status,
      }
      url = vicoDiscomfortCommit
    }
    // console.log(data)
    let method = "POST";
    let token = wx.getStorageSync("login_token");
    let header = {
      token: token,
      "content-type": "application/json"
    };
    if(that.data.commitStatus){
        tokenRequest({ url: url, header: header, method: method, data: data }).then(res => {
            if (res.data.code == 20001) {
                console.log('relogin')
                setTimeout(()=>{
                    that.dataManager(that.data.event)
                },700)
            } else {
                that.data.commitStatus = false;
                wx.showToast({
                    title: "成功",
                    icon: "success"
                });
                setTimeout(() => {
                    wx.navigateBack();
                }, 1500);
            }
        });
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var datetime = options.time, date, time;
    if (options.id != 0) {
      date = datetime.split(" ")[0];
      time = datetime.split(" ")[1].slice(0,-3);
      this.setData({
        serialNo: options.id,
        memo: options.memo,
        feature:options.feature, 
        discomfort:options.name + ',',
        date: date,
        time: time,
        happenDateTime:datetime,
      })
    }
    else {
      this.setData({
        date: util.formatTime2(new Date()),
        time: util.formatTime4(new Date()),
        happenDateTime:util.formatTime3(new Date())
      })
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
    wx.stopPullDownRefresh()
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