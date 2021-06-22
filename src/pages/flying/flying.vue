<template>
  <div class="fly-page">
    <!-- 视频 -->
    <div class="video-wrap">
      <video-player class="video-player vjs-custom-skin"
                  ref="videoPlayer"
                  :playsinline="true"
                  style="object-fit:fill"
                  :options="playerOptions"
                  :x5-video-player-fullscreen="true"
                  @pause="onPlayerPause($event)"
                  @play="onPlayerPlay($event)"
                  @fullscreenchange="onFullscreenChange($event)"
                  @click="fullScreen" />
    </div>

    <!-- 头部 -->
    <div class="head-wrap">
      <div class="head-bg">
        <img class="head-bg-pic" src="/assets/images/header.png">
      </div>
      <p class="head-title">无人机智能操控平台</p>
    </div>

    <!-- 左侧巡检 -->
    <div class="inspect-lft">
      <div class="inspect-cont">
        <img class="inspect-icon" src="/assets/images/icon_time_full.png">
        <span>当前巡检：</span><em>09:10:28</em>
      </div>
    </div>

    <!-- 右侧时间 -->
    <div class="time-rgt">
      <div class="time-cont">
        <span class="time-date">{{ parseTime(currentDate,'{y}-{m}-{d} {h}:{i}:{s} 星期{a}') }}</span>
        <img class="weather-icon" src="/assets/images/icon_sun.png">
      </div>
    </div>

    <!-- 中间信号 -->
    <div class="signal-info">
      <div class="signal-cont">
        <span>信号强度：</span>
        <img class="uav-icon" src="/assets/images/uav-icon.png">
        <img class="signal-icon" src="/assets/icons/signal.svg">
        <img class="control-icon" src="/assets/images/control-icon.png">
        <img class="signal-icon" src="/assets/icons/signal.svg">
        <img class="monitor-icon" src="/assets/images/icon_camera_line.png">
        <img class="signal-icon" src="/assets/icons/signal.svg">
      </div>
    </div>
    
    <!-- 底部 -->
    <div class="botm-wrap clearfix">
      <div class="botm-con">
        
        <div class="btm-lft">
          <div class="data clearfix">
            <div class="data-li">
              <span class="data-label">离机巢剩余距离：</span>
              <p class="data-value"><em class="data-val">300</em><i class="data-unit">m</i></p>
            </div>
            <div class="data-li">
              <span class="data-label">相对高度：</span>
              <p class="data-value"><em class="data-val">300</em><i class="data-unit">m</i></p>
            </div>
            <div class="data-li">
              <span class="data-label">无人机剩余电量：</span>
              <p class="data-value"><em class="data-val">99</em><i class="data-unit">%</i></p>
            </div>
            <div class="data-li">
              <span class="data-label">垂直起降速度：</span>
              <p class="data-value"><em class="data-val">24</em><i class="data-unit">m/s</i></p>
            </div>
            <div class="data-li">
              <span class="data-label">变焦倍数</span>
              <p class="data-value"><em class="data-val">10</em><i class="data-unit">倍</i></p>
            </div>
            <div class="data-li">
              <span class="data-label">水平飞行速度</span>
              <p class="data-value"><em class="data-val">24</em><i class="data-unit">m/s</i></p>
            </div>
            
          </div>
        </div>
        <div class="botm-cont">
            <div class="process">
              <span class="process-star process-end"></span>
              <span class="process-line end"></span>
              <span class="process-star process-curr"></span>
              <span class="process-line"></span>
              <span class="process-star"></span>
              <span class="process-line"></span>
              <span class="process-star"></span>
            </div>
            <div class="process-txt clearfix">
              <div class="process-txt-li">
                <p class="status">下达任务</p>
                <p class="time">2021-06-04 16:55:35</p>
              </div>
              <div class="process-txt-li">
                  <p class="status curr">起飞</p>
                  <p class="time">2021-06-04 16:55:35</p>
              </div>
              <div class="process-txt-li">
                  <p class="status">返航</p>
                  <p class="time">预计10分钟</p>
              </div>
              <div class="process-txt-li">
                  <p class="status">降落</p>
                  <p class="time">预计20分钟</p>
              </div>
            </div>
            <!-- banner -->
            <div class="banner-wrap">
              <div class="all-slide">
                <!-- 轮播 -->
                <!-- <div class="swiper-button-prev" slot="button-prev"></div> -->
                <swiper :options="swiperOption" 
                        ref="mySwiper"
                        :slides-per-view="4"
                        navigation
                        @swiper="onSwiper"
                        @slideChange="onSlideChange"
                        >
                  <!-- slides -->
                  <swiper-slide v-for="item in bannerList" :key="item.id">
                    <div class="img-pic">
                      <img :src="item.imgUrl" alt="">
                    </div>
                    <p class="swiper-txt">{{item.time}}</p>
                  </swiper-slide>
                  
                 
                    <!-- Optional controls -->
              <!--     <div class="swiper-button-prev" slot="button-prev"></div> -->
              <!--     <div class="swiper-button-next" slot="button-next"></div> -->
                </swiper>
                <!-- <div class="swiper-button-next" slot="button-next"></div> -->
              </div>
            </div>
        </div>
      
        <div class="btm-rgt clearfix">
          <div class="center-control">
            <img class="control-poit control-top" src="/assets/images/Polygon1.png" alt="">
            <img class="control-poit control-bottom" src="/assets/images/Polygon2.png" alt="">
            <img class="control-poit control-left" src="/assets/images/Polygon3.png" alt="">
            <img class="control-poit control-right" src="/assets/images/Polygon4.png" alt="">
            <img class="control-ok" src="/assets/images/Polygon-ok.png" alt="">
          </div>
          <div class="btm-btn">
            <div class="btm-btn-item">其他设置</div>
            <div class="btm-btn-item">拍照</div>
            <div class="btm-btn-item">开始录像</div>
            <div class="btm-btn-item btm-btn-over">结束录像</div>

          </div>
        </div>
      </div>
    </div>
   
    <!-- 小地图 -->
    <div class="small-map">
      <p class="map-coor">坐标：195,1828,282,5</p>
      <div id="container" ref="basicMapbox" class="amap">
        <sd-map
          icon="map-marker"
          class="overview-small-map"
          title="map.satellite"
          :polylines="polylines"
          :markers="markers"
        ></sd-map>
      </div> 
    </div>

    <!-- 测试数据 -->
    <div class="cs">
      {{mm}}
    </div>

  </div>
  
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import SdMap from '@/components/map/map.vue';
let dateTime = new Date();
export default {
  data() {
    return {
      playerOptions: {
          playbackRates: [0.5, 1.0, 1.5, 2.0],  //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频
          loop: false, // 导致视频一结束就重新开始。
          
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
            // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          aspectRatio: '16:9',
            // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          fluid: true,
          sources: [{
              //类型
              type: "video/mp4",
              //url地址
              src: '../../assets/videos/aerial1-10s.mp4' 
          }],
          poster: '', //封面地址
          notSupportedMessage: '此视频暂无法播放，请稍后再试',//允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
              timeDivider: true,
              durationDisplay: true,
              remainingTimeDisplay: false,
              fullscreenToggle: true  //全屏按钮
          }
      },
      swiperOption: {
        slidesPerView:4,
        simulateTouch:true,
        loop: true,
        observer: true,
        observeParents: true,
        autoplay: {
          delay: 1000,
          disableOnInteraction: false
        },
        effect: 'slide',
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      },
      bannerList:[
        {
          id:'001',
          imgUrl:'/assets/images/product-img02.jpg',
          time:'2021-06-04 16:55:35'
        },
         {
          id:'002',
          imgUrl:'/assets/images/product-img02.jpg',
          time:'2021-06-04 16:55:35'
        },
         {
          id:'003',
          imgUrl:'/assets/images/product-img02.jpg',
          time:'2021-06-04 16:55:35'
        },
         {
          id:'004',
          imgUrl:'/assets/images/product-img02.jpg',
          time:'2021-06-04 16:55:35'
        }, {
          id:'005',
          imgUrl:'/assets/images/product-img02.jpg',
          time:'2021-06-04 16:55:35'
        }
      ],
      // 当前日期
      currentDate:dateTime,
      // 地图
      markers:[
        {
          "id": "drone1",
          "name": "飞机",
          "type": "drone", // drone: 飞机，显示为可转向的箭头
          "position": { "lng": 120, "lat": 30 },
          "heading": 0 
        },
        {
          "id": "depot1", 
          "name": "机场",
          "type": "depot", // depot：机场，显示为图钉形状的坐标点
          "position": { "lng": 120, "lat": 31 } 
        },
        {
          "id": "action3",
          "type": "action", // 显示为圆形（一个字）或椭圆形（两个字及以上）的坐标点，中间可以显示文字
          "position": { "lng": 121, "lat": 31 },
          "action": ['replay','7k'] 
        },
        {
          "id": "place4",
          "name": "地点4", // 在旁边显示文字提示
          "type": "place", // 其它类型，显示为图钉形状的坐标点，但可以指定颜色，比depot更灵活
          "position": { "lng": 121, "lat": 30 }, 
          "style": { "color": '#409eff' } // 可以填写 css 颜色名称或颜色值
        }
      ],
      polylines:[
        {
          "name": "line1", // 唯一id
          "style": {
            "stroke": "solid", // 折线样式，可为 solid：实线，dotted：圆点虚线，dashed：短线段虚线
            "color": "#67c23a" // 折线颜色，可以填写 css 颜色名称或颜色值
          },
          "coordinates": [ // 折线上每个点的经纬度
            { "lng": 120, "lat": 30 },
            { "lng": 121, "lat": 31 }
          ]
        },
        {
          "name": "line2", // 唯一id
          "style": {
            "stroke": "dashed", // 折线样式，可为 solid：实线，dotted：圆点虚线，dashed：短线段虚线
            "color": "#f69730" // 折线颜色，可以填写 css 颜色名称或颜色值
          },
          "coordinates": [ // 折线上每个点的经纬度
            { "lng": 120, "lat": 30 },
            { "lng": 120, "lat": 31 }
          ]
        },
        {
          "name": "line3", // 唯一id
          "style": {
            "stroke": "dotted", // 折线样式，可为 solid：实线，dotted：圆点虚线，dashed：短线段虚线
            "color": "#409eff" // 折线颜色，可以填写 css 颜色名称或颜色值
          },
          "coordinates": [ // 折线上每个点的经纬度
            { "lng": 120, "lat": 30 },
            { "lng": 121, "lat": 30 }
          ]
        }
      ],
      // mapType
      mapType: 'sd-map-mapbox'
    }
  },
  components: {
    [SdMap.name]: SdMap
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    },
    ...mapState([
      'node',
      'preference'
    ]),
    ...mapGetters([
      'depots',
      'drones'
    ]),
    // 获取地图信息
    mm(){
      console.log('获取数据-depots', this.depots)
      console.log('获取数据-drones', this.drones)
      //  MqttClient.mqtt.publish(`plans/${this.planId}/term`);
      return this.drones
    }
  },
  created() {
    this.setPreference({ mapType });
    
  },
  mounted() {
    this.swiper.slideTo(4, 1000, false)
    // this.getTianQi()
    //  
   
  },
  methods: {
    fullScreen(){},
    onSwiper(swiper) {
      console.log(swiper);
    },
    onSlideChange() {
      console.log('slide change');
    },
    // 获取当前时间
    parseTime(time, pattern) {
      if (arguments.length === 0 || !time) {
        return null
      }
      const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
          time = parseInt(time)
        } else if (typeof time === 'string') {
          time = time.replace(new RegExp(/-/gm), '/');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
          value = '0' + value
        }
        return value || 0
      })
      return time_str
    },
    
    // 地图
    ...mapActions([
      'setPreference'
    ]),

    // 
    
   

  }
  
}
</script>

<style>
.cs{
  position:fixed;
  left:20px;
  top:120px;
  width:1200px;
  height:600px;
  background-color: rebeccapurple;
  color:#fff;
}

.fly-page{
  width:100%;
  height:100vh;
  position: relative;
  overflow: hidden;
}
.video-wrap{
  width:100%;
  height:100%;
  position: absolute;
  left:0;
  top:0;
  z-index:0;
}
.head-bg{
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:161px;
  z-index:1;
}
.head-bg-pic{
  width:100%;
  height:100%;
}
.head-title{
  position: fixed;
  top: 0;
  z-index: 2;
  width: 50%;
  margin:0 25%;
  text-align: center;
  color:#e5f5ff;
  padding-top:10px;
  font-size:32px;
  font-weight: bold;
  line-height: 48px;
  text-shadow: 0 0 14px #4AD4FF;
}
.inspect-lft{
  position: fixed;
  left:74px;
  top: 34px;
  z-index: 2;
}
.inspect-cont{
  display:flex;
  justify-content: flex-start;
  align-items: center;
}
.inspect-icon{
  width:24px;
}
.inspect-cont span,.inspect-cont em{
  font-size:14px;
  color:#fff;
  font-style: normal;
}
.signal-info{
  font-size: 14px;
  color:#fff;
  position: fixed;
  top: 88px;
  z-index: 2;
  width: 50%;
  margin:0 25%;
}
.signal-cont{
  display:flex;
  justify-content: center;
  align-items: center;
}
.monitor-icon{
  width:20px;
  flex-shrink: 0;
}
.signal-icon{
  width: 18px;
  flex-shrink:0;
  margin:0 8px 0 2px;
}
.time-rgt{
  position: fixed;
  right:74px;
  top: 34px;
  z-index: 2;
}
.time-cont{
  display:flex;
  justify-content: flex-end;
  align-items: center;
}
.time-date{
  font-size:14px;
  color:#fff;
  margin-right: 10px;
}
.weather-icon{
  flex-shrink: 0;
  width:24px;
}
.botm-wrap{
  position: fixed;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 334px;
  background: url('assets/images/bottom.png') no-repeat center top;
  background-size: cover
}
.botm-con{
  display: flex;
}
/* bot-lft */
.btm-lft{
  width: 20%;
  flex-shrink: 0;
  text-align: right;
}
.data{
  padding-top: 140px;
}
.data-li{
  width: 42%;
  margin-left: 6%;
  height: 66px;
  float: left;
}
 .data-label{
  font-size: 14px;
  color: #fff;
  line-height: 22px;
}
.data-value{
  margin:0;
}
.data-val{
  font-size:24px;
  line-height:32px;
  color:#32FCCD;
  text-shadow: 0 0 14px #4AD4FF;
}
.data-unit{
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 22px;
}
/* btm-rgt */
.btm-rgt{
  float: right;
  flex-shrink: 0;
  width: 20%;
}
.center-control{
  margin-top:100px;
  padding:79px;
  width: 57px;
  height:57px;
  position:relative;
  float:left;
}
.control-ok{
  width: 57px;
  height:56px;
  cursor: pointer;
}
.control-poit{
  position: absolute;
  width:79px;
  height:79px;
  z-index:2;
  cursor: pointer;
}
.control-top{
  left:50%;
  top:20px;
  margin-left:-39px;
}
.control-bottom{
  left:50%;
  bottom:20px;
  margin-left:-39px;
}
.control-left{
  left:20px;
  top:50%;
  margin-top:-39px;
}
.control-right{
  right:20px;
  top:50%;
  margin-top:-39px;
}
.btm-btn{
  margin-top:150px;
  float: right;
}
.btm-btn-item{
  cursor: pointer;
  margin-top:8px;
  width: 101px;
  height: 33px;
  text-align: center;
  line-height: 33px;
  background:url('assets/images/btn.png')no-repeat center center;
  background-size: contain;
  font-size: 14px;
  color:#fff;
  text-shadow: 0 0 14px #4AD4FF;
  box-shadow: 0 0 26px rgba(43, 200, 253, 0.8)
}
.btm-btn-over{
  background:url('assets/images/btn-1.png')no-repeat center center;
  background-size: contain;
  color:#fff;
  text-shadow: 0 0 14px #fc3239;
  box-shadow: 0 0 26px rgba(252, 50, 57, 0.8)
}
/* btm-center */
.botm-cont{
  /* width: 58%;
  min-width: 1130px; */
  width: 1130px;
  margin: 0 auto;
  flex-grow: 1;
}
/* 流程 */
.process{
  width: 460px;
  height: 34px;
  text-align: center;
  margin: 55px auto 0;
}
.process-star{
  float: left;
  width: 30px;
  height: 30px;
  padding:4px;
  background: url('assets/images/will.png')no-repeat center center;
  background-size: 30px;
}
.process-end{
  background: url('assets/images/end.png')no-repeat center center;
  background-size: contain;
}
.process-curr{
  background: url('assets/images/curr.png')no-repeat center center;
  background-size: contain;
}
.process-line{
  float: left;
  margin-top: 18px;
  width: 100px;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.4)
}
.end{
  background: -webkit-linear-gradient(left, #0BA7FF, #32FCCD);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #0BA7FF, #32FCCD);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #0BA7FF, #32FCCD);
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #0BA7FF, #32FCCD);
  /* 标准的语法 */
  
}
.process-txt{
  width: 536px;
  margin: 0 auto;
  text-align: center;
}
.process-txt-li{
  width: 134px;
  float: left;
}
.process-txt-li .status{
  margin:0;
  font-size: 14px;
  font-weight: bold;
  line-height: 22px;
  color:#fff;
}
.process-txt-li .time{
  margin:0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 18px;
}
.process-txt-li .curr{
  color:#32FCCD;
  text-shadow: 0 0 14px #32FCCD;
}
/* banner */
.banner-wrap{
  min-width: 1130px;
  height: 182px;
  margin: 10px auto 0;
  overflow: hidden;
}
/* .all-slide{
  display: flex;
}
.banner-wrap .swiper-container{
  flex-grow: 1;
  width: 90%;
} */
.banner-wrap .swiper-slide{
  margin: 0 5px;
  width: 266px;
  height: 182px;
}
.banner-wrap .img-pic{
  padding:6px 8px;
  width: 250px;
  height: 146px;
  background: url('assets/images/img.png')no-repeat center center;
  background-size: 100%;
}
/* .banner-wrap .swiper-button-prev,.banner-wrap .swiper-button-next{
  width: 24px;
  height: 64px;
  border-radius: 5px;
  position: relative;
  margin-top:48px;
  flex-shrink: 0;
}
.banner-wrap .swiper-button-prev{
  background: url('assets/images/swiper_button-lft.png')no-repeat center center rgba(255,255,255,0.1);
  background-size: 16px;
  left: 2px;
  margin-right:10px;
}
.banner-wrap .swiper-button-next{
  background: url('assets/images/swiper_button-rgt.png')no-repeat center center rgba(255,255,255,0.1);
  background-size: 16px;
  right:2px;
  margin-left: 10px;
} */
.banner-wrap .swiper-txt{
  margin:4px 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 18px; 
  text-align: center;
}
.banner-wrap .img-pic>img{
  width: 100%;
  height: 100%;
}
/* small map */
.small-map{
  padding:8px;
  width:401px;
  height: 260px;
  position: fixed;
  bottom:260px;
  left: 24px;
  z-index: 2;
  background: url('assets/images/bg.png')no-repeat center center rgba(255,255,255,0.1);
  background-size: contain;
}
.map-coor{
  margin:0;
  padding-left: 20px;
  font-size: 14px;
  color:#fff;
  font-weight: bold;
  line-height: 22px;
}
.amap{
  width: 400px;
  height: 238px;
}
.overview-small-map{
  height:238px;
}


.clearfix:before, .clearfix:after {
    content: "";
    display: table;
}
.clearfix:after {
    clear: both;
}
.clearfix {
    *zoom: 1;
    /*ie6,7*/
}
</style>