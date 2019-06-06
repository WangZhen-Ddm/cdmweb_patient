// pages/communicate/communicate-chat/communicate-chat.js
var util = require('../../../../utils/util.js');
import { tokenRequest } from "../../../../utils/Request";
var app = getApp();
var myMsg = true;
var chatList = [];
var index = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInputValue:'',
    chatList:[],
    toView:'msg-0'
  },
  /**
   * 刷新数据函数
   */
  refresh: function () {
    var that = this;

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var query = wx.createSelectorQuery();
    query.select('weui-textarea')
    chatList = [];
    index = 0;
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
    this.refresh()
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
    this.refresh()
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

  },

  // component function
  // 绑定用户输入
  userInput: function(e){
    this.setData({
      userInputValue: e.detail.value
    })
  },
  // 发送信息
  sendMsg: function(){
    // 获取用户输入信息
    let msgText = this.data.userInputValue;
    if (msgText === "") {
      return
    }
    let msg = {
      myMsg:myMsg,
      dateTime: util.formatTime(new Date()),
      content: msgText,
      flag: 0,
      idx: index
    }
    myMsg = !myMsg;
    index ++;
    chatList.push(msg);
    this.setData({
      chatList: chatList,
      userInputValue: '',
      toView: 'msg-' + msg.idx
    })
  
  },
  onFocus: function(){
    this.setData({
      toView: 'msg-' + chatList[chatList.length - 1].idx
    })
  },
  
})
