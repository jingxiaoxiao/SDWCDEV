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
        <span class="time-date">2021-06-06 09:10:28 星期一</span>
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
                  <swiper-slide>
                    <div class="img-pic">
                      <img src="/assets/images/product-img02.jpg" alt="">
                    </div>
                    <p class="swiper-txt">2021-06-04 16:55:35</p>
                  </swiper-slide>
                  <swiper-slide>
                    <div class="img-pic">
                      <img src="/assets/images/product-img02.jpg" alt="">
                    </div>
                    <p class="swiper-txt">2021-06-04 16:55:35</p>
                  </swiper-slide>
                  <swiper-slide>
                    <div class="img-pic">
                      <img src="/assets/images/product-img02.jpg" alt="">
                    </div>
                    <p class="swiper-txt">2021-06-04 16:55:35</p>
                  </swiper-slide>
                  <swiper-slide>
                    <div class="img-pic">
                      <img src="/assets/images/product-img02.jpg" alt="">
                    </div>
                    <p class="swiper-txt">2021-06-04 16:55:35</p>
                  </swiper-slide>
                  <swiper-slide>
                    <div class="img-pic">
                      <img src="/assets/images/product-img02.jpg" alt="">
                    </div>
                    <p class="swiper-txt">2021-06-04 16:55:35</p>
                  </swiper-slide>
                  <swiper-slide>
                    <div class="img-pic">
                      <img src="/assets/images/product-img02.jpg" alt="">
                    </div>
                    <p class="swiper-txt">2021-06-04 16:55:35</p>
                  </swiper-slide>
                  <swiper-slide>
                    <div class="img-pic">
                      <img src="/assets/images/product-img02.jpg" alt="">
                    </div>
                    <p class="swiper-txt">2021-06-04 16:55:35</p>
                  </swiper-slide>
                 
                    <!-- Optional controls -->
              <!--     <div class="swiper-button-prev" slot="button-prev"></div> -->
              <!--     <div class="swiper-button-next" slot="button-next"></div> -->
                </swiper>
                <!-- <div class="swiper-button-next" slot="button-next"></div> -->
              </div>
            </div>
        </div>
      
        <div class="btm-rgt">
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
      <div id="container" ref="container" class="amap">
       <el-amap
        vid="amapDemo"
        :center="center"
        :zoom="zoom"
        :plugin="plugin"
        class="amap-demo"
        :mapStyle="mapStyle"
        :events="events"
        pitch-enable="false"
      >
        <el-amap-marker
          v-for="(marker,index) in markers"
          :key="index"
          :events="marker.events"
          :position="marker.position"
        />
        <!-- <el-amap-polyline  :path="markers[0].position"></el-amap-polyline> -->
        
        <el-amap-info-window
          v-if="window"
          :position="window.position"
          :visible="window.visible"
          :content="window.content"
          :offset="window.offset"
          :close-when-click-map="true"
          :is-custom="true"
        >
          <div id="info-window">
            <p>{{ window.address }}</p>
            <div class="detail" @click="checkDetail">查看详情</div>
          </div>
        </el-amap-info-window>
      </el-amap>
      </div> 
    </div>

  </div>
  
</template>

<script>
import { AMapManager, lazyAMapApiLoaderInstance } from "vue-amap";
let amapManager = new AMapManager();
export default {
  // :layers="new AMap.TileLayer.Satellite()"
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
      // 
      data: [
        {
          position: "113.645422, 34.730936",
          address: "另一个地址",
        },
        {
          position: "113.685313,34.746453",
          address: "一个地址",
        },
      ],
      zoom: 10,
      center: [113.645422, 34.730936],
      // layerList:new AMap.TileLayer.Satellite(),
      mapStyle:'amap',
      markers: [],
      windows: [],
      window: "",
      events: {
        click(e) {
          const { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;
        },
      },
      lng: 0,
      lat: 0,
      /*一些工具插件*/
      plugin: [
        {
          pName: "DistrictSearch",
          events: {
            init(o) {
              console.log(o);
            },
          },
        },
        {
          // 定位
          pName: "Geolocation",
          events: {
            init(o) {
              // o是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  // 设置经度
                  self.lng = result.position.lng;
                  // 设置维度
                  self.lat = result.position.lat;
                  // 设置坐标
                  self.center = [self.lng, self.lat];
                  self.markers.push([self.lng, self.lat]);
                  // load
                  self.loaded = true;
                  // 页面渲染好后
                  self.$nextTick();
                }
              });
            },
          },
        },
        {
          // 工具栏
          pName: "ToolBar",
          events: {
            init(instance) {
              // console.log(instance);
            },
          },
        },
        {
          // 鹰眼（暂且没用到）
          pName: "OverView",
          events: {
            init(instance) {
              // console.log(instance);
            },
          },
        },
        {
          // 地图类型
          pName: "MapType",
          defaultType: 0,
          events: {
            init(instance) {
              console.log('instance',instance);
            },
          },
        },
        {
          // 搜索（暂且没用到）
          pName: "PlaceSearch",
          events: {
            init(instance) {
              // console.log(instance)
            },
          },
        },
      ], 



      
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
  },
  mounted() {
    this.swiper.slideTo(4, 1000, false)
    this.point()
  },
  methods: {
    fullScreen(){},
    onSwiper(swiper) {
      console.log(swiper);
    },
    onSlideChange() {
      console.log('slide change');
    },

    
    
    point() {
      const markers = [];
      const windows = [];
      let polyline = []
      const that = this;
      this.data.forEach((item, index) => {
        markers.push({
          position: item.position.split(","),
          // icon:item.url, //不设置默认蓝色水滴
          events: {
            click() {
              // 方法：鼠标移动到点标记上，显示相应窗体
              that.windows.forEach((window) => {
                window.visible = false; // 关闭窗体
              });
              that.window = that.windows[index];
              that.$nextTick(() => {
                that.window.visible = true;
              });
            },
          },
        });
        windows.push({
          position: item.position.split(","),
          isCustom: true,
          offset: [115, 55], // 窗体偏移
          showShadow: false,
          visible: false, // 初始是否显示
          address: item.address,
        });
      });
      //  加点
      this.markers = markers;
      // 加弹窗
      this.windows = windows;
    },
    checkDetail() {
      alert("点击了查看详情");
    },

  }
  
}
</script>

<style>
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
  background: url('/assets/images/bottom.png') no-repeat center top;
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
  background:url('/assets/images/btn.png')no-repeat center center;
  background-size: contain;
  font-size: 14px;
  color:#fff;
  text-shadow: 0 0 14px #4AD4FF;
  box-shadow: 0 0 26px rgba(43, 200, 253, 0.8)
}
.btm-btn-over{
  background:url('/assets/images/btn-1.png')no-repeat center center;
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
  background: url('/assets/images/will.png')no-repeat center center;
  background-size: 30px;
}
.process-end{
  background: url('/assets/images/end.png')no-repeat center center;
  background-size: contain;
}
.process-curr{
  background: url('/assets/images/curr.png')no-repeat center center;
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
  background: url('/assets/images/img.png')no-repeat center center;
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
  background: url('/assets/images/swiper_button-lft.png')no-repeat center center rgba(255,255,255,0.1);
  background-size: 16px;
  left: 2px;
  margin-right:10px;
}
.banner-wrap .swiper-button-next{
  background: url('/assets/images/swiper_button-rgt.png')no-repeat center center rgba(255,255,255,0.1);
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
  background: url('/assets/images/bg.png')no-repeat center center rgba(255,255,255,0.1);
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
</style>