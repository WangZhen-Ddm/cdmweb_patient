// pages/input/inputbp/inputbp.js
var util = require("../../../../utils/util.js");
import {
  vicoBloodPressureCommit,
  vicoBloodPressureDelete
} from "../../../../utils/config";
import { tokenRequest } from "../../../../utils/Request";
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: util.formatTime2(new Date()),
    time: util.formatTime4(new Date()),
    measureDateTime: "",
    systolicPressure: "",
    diastolicPressure: "",
    heartRate: "",
    memo: "",
    serialNo: 0,
    status: 0,
    event: {},
    disable:false,
  },

  //page func
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      measureDateTime: e.detail.value + " " + this.data.time + ":00"
    });
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value,
      measureDateTime: this.data.date + " " + e.detail.value + ":00"
    });
  },
  bindInputsystolicPressure: function(e) {
    this.setData({
      systolicPressure: e.detail.value
    });
  },
  bindInputdiastolicPressure: function(e) {
    this.setData({
      diastolicPressure: e.detail.value
    });
  },
  bindInputheartRate: function(e) {
    this.setData({
      heartRate: e.detail.value
    });
  },
  bindInputCom: function(e) {
    this.setData({
      memo: e.detail.value
    });
  },

  /**
   *  数据校验
   */
  inputValidate: function() {
    var systolicPressure = Math.round(this.data.systolicPressure);
    var diastolicPressure = Math.round(this.data.diastolicPressure);
    var heartRate = Math.round(this.data.heartRate);
    let title = "",
      warn = "";
    if (!systolicPressure) title += "收缩压，";
    if (!diastolicPressure) title += "舒张压，";
    if (!heartRate) title += "心率，";
    if (systolicPressure < 60 || systolicPressure > 200) warn += "收缩压，";
    if (diastolicPressure < 40 || diastolicPressure > systolicPressure)
      warn += "舒张压，";
    if (heartRate < 30 || heartRate > 200) warn += "心率，";
    if (title) {
      wx.showToast({
        title: "请输入" + title.slice(0, -1),
        icon: "none"
      });
      return 1;
    } else if (warn) {
      wx.showToast({
        title: warn.slice(0, -1) + "输入异常",
        icon: "none"
      });
      return 1;
    }
    return 0;
  },

  /**
   *  status 新增0 修改 删除255
   */
  dataManager: function(e) {
    var that = this;
    this.setData({
      event: e
    });
    let status = e.currentTarget.dataset.status;
    let data, url;
    //检查数据
    if (this.inputValidate()) {
      return false;
    }
    //set status
    if(status == 255){
      data = {
        serialNo: parseInt(this.data.serialNo),
      }
      url = vicoBloodPressureDelete
    }else if(status == 254){
      data = {
        systolicPressure: parseInt(this.data.systolicPressure),
        diastolicPressure: parseInt(this.data.diastolicPressure),
        heartRate: parseInt(this.data.heartRate),
        measureDateTime: this.data.measureDateTime,
        serialNo: parseInt(this.data.serialNo),
        memo: this.data.memo,
      };  
      url = vicoBloodPressureCommit
    }else{
      data = {
        systolicPressure: parseInt(this.data.systolicPressure),
        diastolicPressure: parseInt(this.data.diastolicPressure),
        heartRate: parseInt(this.data.heartRate),
        measureDateTime: this.data.measureDateTime,
        memo: this.data.memo,
      };
      url = vicoBloodPressureCommit
    }
    this.setData({
      disable:true,
    });
    let method = "POST";
    let token = wx.getStorageSync("login_token");
    let header = {
      token: token,
      "content-type": "application/json"
    };
    tokenRequest({ url: url, header: header, method: method, data: data }).then(
      res => {
        // console.log(res)
        if (res.data.code == 20001) {
          console.log("relogin");
          setTimeout(() => {
            that.dataManager(that.data.event);
          }, 700);
        } else {
          wx.showToast({
            title: "成功",
            icon: "success"
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }
    );
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var datetime = options.time,
      date,
      time;
    if (options.id != 0) {
      date = datetime.split(" ")[0];
      time = datetime.split(" ")[1].slice(0, -3);
      this.setData({
        date: date,
        time: time,
        measureDateTime: datetime,
        systolicPressure: options.sp,
        diastolicPressure: options.dp,
        heartRate: options.hr,
        memo: options.memo,
        serialNo: options.id
      });
    } else {
      this.setData({
        date: util.formatTime2(new Date()),
        time: util.formatTime4(new Date()),
        measureDateTime: util.formatTime3(new Date())
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   
  onShow: function() {
    let token = wx.getStorageSync("login_token");
    let url =
      "wss://cdmwb-dev.vico-lab.com/patient.api/socket/notify/subscribe?token=" +
      token;
    if (
      app.globalData.localSocket.readyState !== 0 &&
      app.globalData.localSocket.readyState !== 1
    ) {
      console.log(
        "开始尝试连接WebSocket！readyState=" +
          app.globalData.localSocket.readyState
      );
      app.initSocket(url);
    }

    app.globalData.callback = function(res) {
      setTimeout(() => {
        let resData = res.data
        wx.redirectTo({
          url:"/pages/input/inputtip/inputtip?resdata=" + resData          
        });
      }, 1500);
    };
  },
*/
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
