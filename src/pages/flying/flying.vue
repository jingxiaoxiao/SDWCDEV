<template>
  <div class="fly-page">
    <!-- 视频、地图切换按钮 -->
    <!-- <div class="uav-start-fly" @click="goSuspend">
      <span>停飞页面</span>
    </div> -->
    <div v-if="isRunning" class="uav-start-fly  uav-start-stop" @click="handleStop">
      <span>立即停飞</span>
    </div>
    <!-- 地图、视频 大屏幕 -->
    <div class="video-wrap">
      <!-- <video-player class="video-player vjs-custom-skin"
                  ref="videoPlayer"
                  :playsinline="true"
                  style="object-fit:fill"
                  :options="playerOptions"
                  :x5-video-player-fullscreen="true"
                  @pause="onPlayerPause($event)"
                  @play="onPlayerPlay($event)"
                  @fullscreenchange="onFullscreenChange($event)"
                  @click="fullScreen" /> -->
     
     
      <template v-if="videoBigShow">
        <!-- 视频 cs -->
        <template v-for="{ point, compo, key } of points">
          <component
            :is="compo"
            :key="key"
            :info="nodeObj.info"
            :point="point"
            :status="nodeObj.status"
            :msg="nodeObj.msg"
            :starTime="starTime"
            :flyDuration="flyDuration"
            :landTime="landTime"
            :videoBigShow="videoBigShow"
          ></component>
        </template>
      </template>
      <template v-else>
        <div id="container" ref="basicMapbox" class="amap">
          <!-- <sd-map class="overview-small-map" v-bind="map"></sd-map> -->
          <sd-map
            icon="map-marker"
            class="overview-small-map"
            title="map.satellite"
            :polylines="polylines"
            :markers="markers"
            v-bind="map"
          ></sd-map>
        </div> 
      </template>
     
    </div>

    <!-- 小地图、视频 小屏幕 -->
    <div class="small-map">
      <template v-if="videoBigShow">
        <p class="map-coor"  @click="handleChage">坐标：{{lngLatObj.lng}},{{lngLatObj.lat}}</p>
        <div id="container" ref="basicMapbox" class="amap">
          <!-- DroneMap -->
          <!-- <sd-map class="overview-small-map" v-bind="map"></sd-map> -->
           <sd-map
            icon="map-marker"
            class="overview-small-map"
            title="map.satellite"
            :polylines="polylines"
            :markers="markers"
            v-bind="map"
          ></sd-map>
            <!-- <sd-map
            class="overview-small-map"
            icon="map-marker"
            title="map.satellite"
            :polylines="polylines"
            :markers="markers"
            :heatmap="drones[0].msg.heatmap"
            :follow="follow"
            selectable
            :popover-shown="popover.show"
          >
           <template #action>
              <el-button icon="el-icon-delete" size="small" @click="handlePathClear">
                <span v-t="'map.clear'"></span>ddsd
              </el-button>
           </template>
          </sd-map> -->
        </div> 
      </template>
      <template v-else>
        <p class="map-coor" @click="handleChage">视频</p>
        <!-- 视频 cs -->
        <template v-for="{ point, compo, key } of points">
          <component
            :is="compo"
            :key="key"
            :info="nodeObj.info"
            :point="point"
            :status="nodeObj.status"
            :msg="nodeObj.msg"
            :starTime="starTime"
            :flyDuration="flyDuration"
            :landTime="landTime"
            :videoBigShow="videoBigShow"
          ></component>
        </template>
      </template>
      
    </div>
  
    <!-- 机巢视频 -->
    <div class="small-map small-map-rgt" v-show="startLandShow">
      <p class="map-coor">机场监控设备</p>
      <div class="small-map-rgt-div">
        <template v-for="{ point, compo, key } of pointsDepot">
          <!-- <component
            :is="compo"
            :key="key"
            :info="selectedNodeDepot.info"
            :point="point"
            :status="selectedNodeDepot.status"
            :msg="selectedNodeDepot.msg"
            :starTime="starTime"
            :flyDuration="flyDuration"
            :landTime="landTime"
            :videoBigShow="videoBigShow"
          ></component> -->
          <!-- Monitor -->
          <sd-node-monitor
            :key="key"
            :point="point"
            :status="selectedNodeDepot.status"
            :msg="selectedNodeDepot.msg"
            :info="selectedNodeDepot.info"
          ></sd-node-monitor>
        </template>
      </div>
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
        <span>当前巡检：</span><em>{{duration}}</em>
        <h4 style="color:red;display:none;">无人机模式：{{droneStatus}}</h4>
        <!-- <h4 style="color:red">无人机模式-返航时间：{{actualLand}}</h4> -->
      </div>
    </div>

    <!-- 右侧时间 -->
    <div class="time-rgt">
      <div class="time-cont">
        <span class="time-date">{{currentTime}} 星期{{ (parseTime(currentDate,'{y}-{m}-{d} {h}:{i}:{s} 星期{a}')).split('星期')[1] }}</span>
        <!-- <img class="weather-icon" src="/assets/images/icon_sun.png"> -->
         <span class="weather-icon-txt">{{weather.text}}</span>
        
      </div>
    </div>

    <!-- 中间信号 -->
    <!-- <div class="signal-info">
      <div class="signal-cont">
        <span class="signal-label">信号强度：</span>
        <img class="uav-icon" src="/assets/images/uav-icon.png">
        <div class="signal-contion">
          <div class="signal-con">
            <span :class="[droneSignal>=1?'signal-one signal-on':'signal-one']"></span>
            <span :class="[droneSignal>=2?'signal-two signal-on':'signal-two']"></span>
            <span :class="[droneSignal>=3?'signal-three signal-on':'signal-three']"></span>
            <span :class="[droneSignal>=4?'signal-four signal-on':'signal-four']"></span>
            <span :class="[droneSignal>=5?'signal-five signal-on':'signal-five']"></span>
          </div>
        </div>
        <img class="signal-icon" src="/assets/icons/signal.svg">
        <img class="control-icon" src="/assets/images/control-icon.png">
        <img class="signal-icon" src="/assets/icons/signal.svg">
        <img class="monitor-icon" src="/assets/icons/satellite.svg">
        <span class="signal-icon">{{gpsObj.satcount}}星</span>
        <span class="signal-icon">{{gpsObj.type}}</span>
        <img class="signal-icon" src="/assets/icons/signal.svg">
      </div>
    </div> -->
    
     <!-- 底部 -->
    <div class="botm-wrap clearfix">
      <div class="botm-con">
        
        <div class="btm-lft">
          <div class="data clearfix">
            <div class="data-li">
              <span class="data-label">水平速度：</span>
              <p class="data-value"><em class="data-val">{{droneSpeed}}</em><i class="data-unit">m/s</i></p>
            </div>
            <div class="data-li">
              <span class="data-label">电量：</span>
              <p class="data-value"><em class="data-val">{{droneRemain}}</em><i class="data-unit">%</i></p>
            </div>
            <div class="data-li">
              <span class="data-label">信号强度</span>
              <p class="data-value"><em class="data-val">{{droneSignal}}</em><i class="data-unit">%</i></p>
            </div>
            <div class="data-li">
              <span class="data-label">相对高度：</span>
              <p class="data-value"><em class="data-val">{{droneHeight}}</em><i class="data-unit">m</i></p>
            </div>
            <div class="data-li">
              <span class="data-label">电压：</span>
              <p class="data-value"><em class="data-val">{{droneVoltage}}</em><i class="data-unit">V</i></p>
            </div>
            <div class="data-li">
              <span class="data-label">GPS</span>
              <p class="data-value">
                <em class="data-val"> {{gpsObj.satcount}}</em>
                <i class="data-unit">星</i>
                <!-- <i class="data-unit">星{{gpsObj.type}}</i> -->
                </p>
            </div>
            
          </div>
        </div>
        <div class="botm-cont">
            <div class="process">
              <template v-if="flyStatus === 1">
                <span class="process-star process-curr"></span>
                <span class="process-line"></span>
                <span class="process-star"></span>
                <span class="process-line"></span>
                <span class="process-star"></span>
                <span class="process-line"></span>
                <span class="process-star"></span>
              </template>
              <template v-else-if="flyStatus === 2">
                <span class="process-star process-end"></span>
                <span class="process-line end"></span>
                <span class="process-star process-curr"></span>
                <span class="process-line"></span>
                <span class="process-star"></span>
                <span class="process-line"></span>
                <span class="process-star"></span>
              </template>
              <template v-else-if="flyStatus === 3">
                <span class="process-star process-end"></span>
                <span class="process-line end"></span>
                <span class="process-star process-end"></span>
                <span class="process-line end"></span>
                <span class="process-star process-curr" ></span>
                <span class="process-line"></span>
                <span class="process-star"></span>
              </template>
              <template v-else-if="flyStatus === 4">
                <span class="process-star process-end"></span>
                <span class="process-line end"></span>
                <span class="process-star process-end"></span>
                <span class="process-line end"></span>
                <span class="process-star process-end" ></span>
                <span class="process-line end"></span>
                <span class="process-star process-curr"></span>
              </template>
              <template v-else>
                <span class="process-star"></span>
                <span class="process-line"></span>
                <span class="process-star"></span>
                <span class="process-line"></span>
                <span class="process-star"></span>
                <span class="process-line"></span>
                <span class="process-star"></span>
              </template>
            </div>
            <div class="process-txt clearfix">
              <div class="process-txt-li">
                <p :class="flyStatus === 1 ? 'status curr' : 'status'">下达任务</p>
                <!-- {{parseTime((new Date()),'{y}-{m}-{d}')}} -->
                <p class="time"> {{execute.executeTime}}</p>
              </div>
              <div class="process-txt-li">
                  <p :class="flyStatus === 2 ? 'status curr' : 'status'">起飞</p>
                  <template v-if="actualStar != ''">
                    <p class="time">{{actualStar}}</p>
                  </template>
                  <template v-else>
                    <p class="time">{{starTime}}</p>
                  </template>
              </div>
              <div class="process-txt-li">
                  <p :class="flyStatus === 3 ? 'status curr' : 'status'">返航</p>
                  <template v-if="actualLand != ''">
                    <p class="time">{{actualLand}}</p>
                  </template>
                  <template v-else>
                    <p class="time">{{landTime}}</p>
                  </template>
              </div>
              <div class="process-txt-li">
                  <p :class="flyStatus === 4 ? 'status curr' : 'status'">降落</p>
                  <template v-if="actualDuration != ''">
                    <p class="time">{{actualDuration}}</p>
                  </template>
                  <template v-else>
                    <p class="time">{{flyDuration}}</p>
                  </template>
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
                  <swiper-slide v-for="(item, index) in bannerList" :key="index">
                    <div class="img-pic">
                      <!-- <img :src="item.imgUrl" alt=""> -->
                    </div>
                    <p class="swiper-txt">{{item.time}}-{{index}}</p>
                  </swiper-slide>             
                  <!-- Optional controls -->
                  <!-- <div class="swiper-button-prev" slot="button-prev"></div> -->
                  <!--<div class="swiper-button-next" slot="button-next"></div> -->
                </swiper>
                <!-- <div class="swiper-button-next" slot="button-next"></div> -->
              </div>
            </div>
        </div>
      
        <div class="btm-rgt clearfix">
          <!-- {{points}} -->
          <template v-for="{ point, compo, key } of points">
            <div :key="key">
              <template>
                <operation 
                  v-if="compo!=''"
                  :point="point" 
                  :status="nodeObj.status"
                  :msg="nodeObj.msg"
                  :videoBigShow="videoBigShow">
                </operation>
              </template>
            </div>
          </template>

        </div>
      </div>
    </div>

    <!-- 放大图片 -->
    <!-- //显示图片的组件 -->
    <sd-pic-show :imgUrl="picurl" :imgShow="imgShow" :list="bannerList" :curInd="currInd" @closeimg="imgClose"></sd-pic-show>

    <!-- 测试 -->
    <!-- {{droneId}} -->
    
    <!-- 测试图片 -->
    <sd-job-file ref="jobFile"></sd-job-file>

  </div>
  
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import SdMap from '@/components/map/map.vue';
import MqttClient from '@/api/mqtt';
let dateTime = new Date();

// 视频 cs
// import Control from '@/components/drone/control.vue';
// import Monitor from '@/components/drone/video.vue';
import DroneMap from '@/components/drone/map.vue';
import get from 'lodash/get';
import { PlaceStyle } from '@/constants/drone-place-style';
import Custom from '@/components/custom/custom.vue';
import Settings from '@/components/settings/settings.vue';

import MonitorDepot from '@/components/monitor/video.vue';

import Monitor from '@/components/drone/video2.vue';
import Operation from '@/components/drone/operation.vue';

import { getPlanJobs, picBlob, cancelPlanJob } from '@/api/super-dock';
import JobFile from '@/components/job-file/job-file.vue';

import { weather, minutely, warning } from '@/api/heweather';

import { waypointsToMapProps } from '@/pages/plan/common';
import { parseWaypoints } from '@/util/waypoint-parser';

import PicShow from './picShow.vue';


const CompoName = {
  // 'map': DroneMap.name,
  'custom': Custom.name,
  // 'console': Control.name,
  'settings': Settings.name,
  'iframe': Monitor.name,
  'livestream_img': Monitor.name,
  'livestream_flv': Monitor.name,
  'livestream_hls': Monitor.name,
  'livestream_webrtc': Monitor.name,
  'livestream_webrtc2': Monitor.name,
  'livestream_webrtc3': Monitor.name,
  'livestream_webrtc4': Monitor.name
};

const CompoOrder = {
  [Monitor.name]: 2,
  // [DroneMap.name]: 3,
  [Custom.name]: 6,
  // [Control.name]: 9,
  [Settings.name]: 10,
};
let _that = this


export default {
  data() {
    return {
      map: {},
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
       // banner
      swiperOption: {},
      bannerList:[
        {
          id:'001',
          imgUrl: '../assets/images/airport-icon1.png',
          time:'2021-06-04 16:55:35'
        },
         {
          id:'002',
          imgUrl: '../assets/images/airport-icon2.png',
          time:'2021-06-04 16:55:35'
        },
         {
          id:'003',
          imgUrl: '../assets/images/airport-icon3.png',
          time:'2021-06-04 16:55:35'
        },
         {
          id:'004',
          imgUrl: '../assets/images/airport-icon4.png',
          time:'2021-06-04 16:55:35'
        }, {
          id:'005',
          imgUrl: "../assets/images/airport-icon5.png",
          time:'2021-06-04 16:55:35'
        }, {
          id:'006',
          imgUrl: "../assets/images/airport-icon6.png",
          time:'2021-06-04 16:55:35'
        }
      ],
      // 当前日期
      currentDate:dateTime,
      // 获取实时当前时间
      timer: "",//定义一个定时器的变量
      currentTime: new Date(), // 获取当前时间
      // mapType
      mapType: 'sd-map-mapbox',
      // 停飞页面传来值
      planId:undefined,
      starTime:'2021-05-25 15:45:22',
      flyDuration:'2021-05-25 15:55:22',
      landTime:'2021-05-25 16:45:22',
      // actual实际时间
      actualStar:'',//实际起飞时间
      actualLand:'',//实际返航时间
      actualDuration:'',//实际降落时间
      startLandShow: false, //是否开始返航
      // 天气
      weatherTxt:'',
      // 视频是否是大屏
      videoBigShow: true,
      // 飞机状态
      flyStatus:0,
      // 历史任务
      jobs: [],
      job: {
        loading: false,
        order: 'descending'
      },
      pagination: {
        size: 10,
        current: 1
      },
       // 天气
      weather: {},
      // 
      follow: false,
      popover: {
        show: false,
        coordinate: null
      },
      // 2021-07-20
      waypoints: [],
      // 图片放大
      picurl:'',
      imgShow:false,
      currInd:undefined,
      // 是否点击立即停飞 （1-未点击，0-点击）
      isSuspend:1,

    }
  },
  watch: {
    ['msgD.msg.waypoint']:{
      immediate: true,
      handler() {
        this.updateCurrentWaypoints();
      }
    }
  },
  components: {
    [SdMap.name]: SdMap,
    // 视频 cs 
    [Custom.name]: Custom,
    // [Control.name]: Control,
    // [DroneMap.name]: DroneMap,
    [Monitor.name]: Monitor,
    [Settings.name]: Settings,
    Operation,
    [JobFile.name]: JobFile,
    // DroneMap
    [DroneMap.name]: DroneMap,
    [MonitorDepot.name]:MonitorDepot,
    [PicShow.name]: PicShow
  },
  computed: {
    swiper() {
      console.log('这是swiper', this)
      return this.$refs.mySwiper.$swiper
    },
    ...mapState([
      'node',
      'preference',
      'execute'
    ]),
    ...mapGetters([
      'depots',
      'drones'
    ]),
    // 无人机
    msgD(){
      for (const d of this.drones) {
        return d
      }
    },
    // 2021-07-20无人机点线
    placeStyle() {
       for (const d of this.drones) {
         d.info.points.map(point => {
           if (!point.params) return PlaceStyle;
           let placeStyle = Object.assign({}, PlaceStyle, get(point, 'params.common.place', {}))
            console.log('placeStyle-2',placeStyle);
           return placeStyle;
         })
       }
    },
    polylines() {
      let placeStyle;
      for (const d of this.drones) {
         d.info.points.map(point => {
           if (!point.params) return PlaceStyle;
           placeStyle = Object.assign({}, PlaceStyle, get(point, 'params.common.place', {}))
            console.log('placeStyle-polylines-2',placeStyle);
          //  return placeStyle;
         })
       }
      console.log('地图路线-polylines-1ddd',placeStyle);
      let that = this
      const polylines = [];
      for (const d of this.drones) {
        const { position, place } = d.msg;
        for (const wp of this.waypoints) {
          polylines.push({
            name: `waypoint${polylines.length}`,
            style: { stroke: 'solid', color: '#ea4335' },
            coordinates: wp.coordinates
          });
        }
        if (position.length > 0) {
          polylines.push({
            name: 'path',
            style: { stroke: 'solid', color: '#909399' },
            coordinates: position
          });
          const origin = position[0];

          for (const [name, pos] of Object.entries(place)) {
            let namee = name.toString()
            const style = placeStyle[namee] || {};
            if (style.stroke) {
              polylines.push({
                name: name,
                style: style,
                coordinates: [origin, pos]
              });
            }
          }
        }
      }
      console.log('地图路线d',polylines);
      
      return polylines;
    },
    droneMarkers() {
      const markers = [];
      
      for (let d of this.drones) {
        
      // console.log('无人机信息1', d);
        const position = d.msg.position[0];
        if (d.status.code === 0 && typeof position === 'object') {
          markers.push({
            type: 'drone',
            id: d.info.id,
            name: d.info.name,
            position,
            heading: position.heading
          });
        }
      }
      return markers;
    },
    depotMarkers() {
      const markers = [];
      for (const d of this.depots) {
        const { code, status } = d.status;
        if (code === 0 && status.link_id === this.drones[0].info.id) {
          markers.push({
            type: 'depot',
            id: d.info.id,
            name: d.info.name,
            position: {
              lng: status.lng,
              lat: status.lat,
            }
          });
        }
      }
      return markers;
    },
    placeMarkers() {
      let placeStyle;
      for (const d of this.drones) {
         d.info.points.map(point => {
           if (!point.params) return PlaceStyle;
           placeStyle = Object.assign({}, PlaceStyle, get(point, 'params.common.place', {}))
            console.log('placeStyle-placeMarkers-2',placeStyle);
          //  return placeStyle;
         })
       }
      console.log('地图路线-placeMarkers-1ddd',placeStyle);

      const { place } = this.drones[0].msg;
      const markers = [];

      for (const [name, pos] of Object.entries(place)) {
          const style = placeStyle[name] || {};
          markers.push({
            type: 'place',
            id: name,
            name: name,
            style: style,
            position: pos
          });
      }
      return markers;
    },
    markers() {
      console.log('waypoints-原始',this.waypoints.map(w => w.markers).flat());
      // console.log('获取数据-无人机-markers', ...this.depotMarkers)
      // return [...this.depotMarkers, ...this.droneMarkers, ...this.placeMarkers];
       return [
        ...this.waypoints.map(w => w.markers).flat(),
        ...this.droneMarkers,
        ...this.depotMarkers,
        ...this.placeMarkers
      ];
    },
    // 当前巡检 = 时长
    duration() {
      let time = undefined
      const options = {
        timeZone: 'UTC',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      for (let d of this.drones) {
        time = d.msg.drone_status.time;
      }
      if (time >= 3600) options.hour = 'numeric';
      return new Date(time * 1000).toLocaleString('en-US', options);
    },
   
    // 无人机id
    droneId() {
      let droneOlny = undefined
      for (let d of this.drones) {
        droneOlny = d.info.id
      }
      return droneOlny;
    },
    // 当前nodeObj
    nodeObj() {
      const nodeId = this.droneId;
      let node = this.node.find(node => node.info.id === nodeId);
      return node
    },
    // 坐标
    // position
    lngLatObj() {
      let lng = undefined
      let lat = undefined
      for (let d of this.drones) {
        lng = d.msg.position[0].lng
        lat = d.msg.position[0].lat
      }
      let lngLat = {
        lng:lng,
        lat:lat
      }
      return lngLat;
    },
    // 无人机-视频 cs
    points() {
      let i = 0;
      const nodeId = this.droneId;
      let node = this.node.find(node => node.info.id === nodeId);
      return this.nodeObj.info.points.map(point => {
        const { id, point_type_name } = point;
        const compo = CompoName[point_type_name] || '';
        const key = `${nodeId}-${id}-${point_type_name}-${i++}`;
        return { point, compo, key };
      }).sort((a, b) => CompoOrder[a.compo] - CompoOrder[b.compo]);
    },

    // 2021-07-21机场监控设备-视频
    pointsDepot() {
      let i = 1;
      const nodeId = this.depotsId;
      let node = this.node.find(node => node.info.id === nodeId);
     
      // // 之前代码
      let videoObj 
      this.selectedNodeDepot.info.points.map(point => {
        if(point.point_type_name == "livestream_webrtc2"){
          console.log('视频',point);
          const { id, point_type_name } = point;
          const compo = '';
          const key = `${nodeId}-${id}-${point_type_name}-${i++}`;
          videoObj =  { point, compo, key }
          // return { point, compo, key };
        }
      });
      console.log('视频2',videoObj);
      let videoArr = []
      videoArr.push(videoObj)
      return videoArr
    },
  
    // 底部
    // 无人机-电量占比
    droneRemain() { 
      let remainVal = undefined
      for (let d of this.drones) {
        remainVal = d.msg.battery.remain
      }
      return remainVal;
    },
    // 无人机-高度
    droneHeight() {
      let heightVal = undefined
      for (let d of this.drones) {
        heightVal = d.msg.drone_status.height
      }
      return heightVal;
    },
    // 无人机-飞行速度
    droneSpeed() {
      let speedVal = undefined
      for (let d of this.drones) {
        speedVal = d.msg.drone_status.speed
      }
      return speedVal;
    },
    // 无人机-信号
    droneSignal() {
      let signalVal = undefined
      for (let d of this.drones) {
        signalVal = d.msg.drone_status.signal
      }
      let signalNum = undefined
      // 五条信号显示个数
      // if(signalVal<=20){
      //   signalNum = 1
      // } else if(20<signalVal<=40){
      //   signalNum = 2
      // } else if(40<signalVal<=60){
      //   signalNum = 3
      // } else if(60<signalVal<=80){
      //   signalNum = 4
      // } else if(80<signalVal){
      //   signalNum = 5
      // }
      return signalVal;
    },
    // 模式-判断是否返航
    // TODO 获取返航和回巢时间，如果没有，就判断下现在的状态并获取当前时间来记录返航和回巢时间
    droneStatus(){
      let modeVal = undefined
      for (let d of this.drones) {
        // console.log('无人机模式：', d.msg.drone_status.mode);
        // console.log('无人机模式-日志：',d.msg);
        if(d.msg.notification && d.msg.notification.length>0){
          
          if(d.msg.notification[0].msg == "开始起飞"){
            this.actualStar = this.timestampToTime(d.msg.notification[0].time)
            this.flyStatus = 2
            console.log('无人机模式状态-开始起飞', this.flyStatus);
            
          }
          if(d.msg.notification[0].msg == "开始返航"){
            this.actualLand = this.timestampToTime(d.msg.notification[0].time)
            this.startLandShow = true
            this.flyStatus = 3
             console.log('无人机模式状态-开始返航', this.flyStatus);
          }
          // 先“返航完成”，后“任务执行完成”
          // TODO不知道哪个时间是定义为降落时间
          // TODO 任务执行完成 时图片下载完毕可以获取图片了
          if(d.msg.notification[0].msg == "返航完成"){
            
            this.actualDuration = this.timestampToTime(d.msg.notification[0].time) 
            this.flyStatus = 4
            console.log('无人机模式状态-返航完成', this.flyStatus);
          }
        }

        modeVal = d.msg.drone_status.mode
        // if(d.msg.drone_status.mode == '返航'){
        //   this.actualLand = updated_at
        //   this.actualDuration = ''
        // } else if(d.msg.drone_status.mode == '降落') { 
        //   this.actualLand = ''
        //   this.actualDuration = updated_at
        // }
      }
      return modeVal;
    },
    // gps
    gpsObj() {
      let gpsObj = {}
      for (let d of this.drones) {
        gpsObj.type = d.msg.drone_status.gps.type
        gpsObj.satcount = d.msg.drone_status.gps.satcount
      }
      return gpsObj
    },
    // 无人机-电压
    droneVoltage() {
      let voltageVal = undefined
      for (let d of this.drones) {
        voltageVal = d.msg.drone_status.battery.voltage
      }
      return voltageVal;
    },
    // 机场id
    depotsId() {
      let depotsOlny = undefined
      for (let d of this.depots) {
        depotsOlny = d.info.id
      }
      return depotsOlny;
    },
    // 机场信息
    selectedNodeDepot() {
      return this.node.find(node => node.info.id === this.depotsId);
    },
    //图片
    ...mapState({ 
        /**
       * @param {SDWC.State} state
       * @returns {SDWC.PlanRunningContent}
       */
      runningContent(state) {
        /** @type {SDWC.PlanRunning} */
        const running = state.plan.running.find(r => r.id === this.planId);
        return running ? running.running : null;
      },
      plans: state => state.plan.info,
    }),
     // 
    isRunning() {
      // 是否执行完成
      return this.runningContent !== null;
    },
    plan() {
      // 当前plans
      return this.plans.find(p => p.id === this.planId);
    },
    
  },
  methods: {
    fullScreen(){},
    onSwiper(swiper) {},
    onSlideChange() {},
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
        if(time !== null){
          if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
          }
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
    // 时间转换mmTime 
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000)//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
      var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' '
      var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':'
      var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':'
      var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds())
      return Y+M+D+h+m+s;
    },
    
    // 地图
    ...mapActions([
      'setPreference',
      'clearDronePath'
    ]),
    ...mapActions([
      'getPlanWaypoints'
    ]),

     handlePathClear() {
       console.log('清楚',this.drones[0]);
       
      this.clearDronePath(this.drones[0].info.id);
    },
    // 订阅测试
    // submm() {
    //  let subval = MqttClient.mqtt.subscribe(`plans/${this.droneId}/status`);
    // }
    // 去除前面补零
    removeZero(val){
      if(val !== null){
        let str = val.toString()
        let fistChar = str.substr(0, 1)
        let fistNum = Number(fistChar)
        if(fistNum == 0){
          return Number(str.substr(1, 2))
        }else{
          return Number(str)
        }
      } 
    },
    // 时间转换成秒
    changeSecond(val){
      let onTime = this.parseTime(val,'{h}:{i}:{s}')
      if(onTime !== null){
        let onArr = onTime.toString().split(':');
        let onSecond = this.removeZero(onArr[0])*3600 + this.removeZero(onArr[1])*60 + this.removeZero(onArr[2])
        return onSecond
      }
    },
    // 进度条状态
    processSatus(){
      // 当前状态
      let onHms = this.changeSecond(new Date())
      // 起飞 this.starTime 
      let starHms;
      let landHms;
      let durateHms;
      if(this.actualStar != ''){
        starHms = this.changeSecond(this.actualStar)
      } else{
        starHms = this.changeSecond(this.starTime)
      }
      // 返航 this.landTime 
      if(this.actualLand != ''){
        landHms = this.changeSecond(this.actualLand)
      } else{
        landHms = this.changeSecond(this.landTime)
      }
      // 降落 this.flyDuration  actualDuration
      if(this.actualDuration != ''){
        durateHms = this.changeSecond(this.actualDuration)
      } else{
        durateHms = this.changeSecond(this.flyDuration)
      }
      
      console.log('页面无人机状态-zzz-当前',onHms);
      if(onHms < starHms){
        this.flyStatus = 1
      } else if(starHms < onHms < landHms){
        console.log('页面无人机状态-zzz-起飞',starHms);
        this.flyStatus = 2
      } else if(landHms < onHms < durateHms){
        console.log('页面无人机状态-zzz-返航',landHms);
        this.flyStatus = 3
      } else if(onHms > durateHms){
        console.log('页面无人机状态-zzz-降落',durateHms);
        this.flyStatus = 4
      } else{
        this.flyStatus = 0
      }
       
    },
    // 返回停飞页面
    goSuspend() {
      // this.processSatus()
      // 飞行状态 flyStatus
      // let mm = 4
      console.log('页面无人机状态-zzz-最终',this.flyStatus);
      
      this.$router.push({
        path: "/suspend",
        query: { planId: this.planId, flyStatus:this.flyStatus },
      });
    },
    // 视频和地图切换
    handleChage() {
      this.videoBigShow = !this.videoBigShow
    },
    // 图片
    // 判断是否降落
    async getPlanJobs() {
      this.job.loading = true;
      const res = await getPlanJobs(this.planId);
      if (this.isRunning) {
        this.patchRunningJob(res, this.runningContent.job);
      }
      res.forEach(l => l.created_at = new Date(l.created_at));
      this.jobs = res;
      console.log('任务历史',this.jobs)
      this.job.loading = false;
      
      // if(this.jobs.files.name == "下载链接"){
        // this.$refs.jobFile.open(this.jobs.files.blobId);
        // 测试
        let blobID = 913
        // this.$refs.jobFile.open(blobID);
      // }

      // 2021-07-14 新增内容
      this.jobs.forEach(item => {
        if(item.id == this.planId ){
          console.log('具体files内容-飞行中：', item)
          if(item.files['下载链接']){
            console.log('有下载链接') 
            this.picBlob(item.files['下载链接'])
          }else{
           console.log('没有下载链接') 
          }
        }
       
      })
       
    },
    // 获取具体任务下的图片集合
    async picBlob(fileId) {
      let mm = '231'
      let res = await picBlob(mm);
      console.log('历史图片集合：', res)
    },
    /**
     * @param {SDWC.PlanJob[]} jobs
     * @param {SDWC.PlanRunningContentJob} runningJob
     */
    patchRunningJob(jobs, runningJob) {
      if (!runningJob || !runningJob.job_id) return;
      /** @type {SDWC.PlanJob} */
      const job = jobs.find(j => j.job_id === runningJob.job_id);
      if (typeof job !== 'object') {
        const now = new Date();
        jobs.unshift(Object.assign({
          temporary: true,
          id: runningJob.job_id,
          plan_id: this.planId,
          created_at: now,
          updated_at: now
        }, runningJob));
      } else {
        if (job.temporary) {
          job.files = runningJob.files;
          job.extra = runningJob.extra;
        } else {
          job.files = Object.assign({}, job.files, runningJob.files);
          job.extra = Object.assign({}, job.extra, runningJob.extra);
        }
      }
    },
    // 2021-07-21航点
    async updateCurrentWaypoints() {
      const waypoints = [];
      for (const url of Object.values(this.drones[0].msg.waypoint)) {
        const wp = await fetch(url)
          .then(res =>res.text())
          .then(text => parseWaypoints(text));
        const i = waypoints.length;
        wp.actions.forEach(a => a.id = `wp${i}_${a.id}`);
        waypoints.push({
          coordinates: wp.path,
          markers: wp.actions
        });
      }
      this.waypoints = waypoints;
    },
    
    // 天气
    getWeather() {
      const { lng, lat } = this.selectedNodeDepot.status.status;
      console.log('天气',Promise.all([weather(lng, lat).then(data => this.weather = data.now || {}),warning(lng, lat).then(data => this.alert = data.warning || [])]));
      
      return Promise.all([
        weather(lng, lat).then(data => this.weather = data.now || {}),
        warning(lng, lat).then(data => this.alert = data.warning || [])
      ]);
    },
    // 小于10补0
    appendZero(obj) {
      if (obj < 10) {
        return "0" + obj;
      } else {
        return obj;
      }
    },
    // 预览大图关闭
    imgClose(){
      this.imgShow = false
    },

     // 停飞
    handleStop() {
      // console.log('点击取消飞行');
      this.isSuspend = 0
      // 点击立即停飞后的弹框
      // this.$nextTick(() => this.$refs.planDialog.close());
      if (!this.isRunning) return;
      /**
       * mutate element-ui's Notification object
       * @see https://github.com/ElemeFE/element/blob/v2.8.2/packages/notification/src/main.vue
       */
      // const n = this.$notify({
      //   offset: 50,
      //   duration: 0,
      //   type: 'info',
      //   title: '测试测试MMM',
      //   message: this.$t('plan.view.pending'),
      // });
      // cancelPlanJob(this.planId, this.runningContent.id).then(() => {
      //   Object.assign(n.$data, {
      //     message: this.$t('plan.view.stop_run'),
      //     type: 'warning',
      //     duration: 2000
      //   });
      //   n.startTimer();
      // }).catch(e => {
      //   Object.assign(n.$data, {
      //     message: this.$t('plan.view.stop_fail', { code: e.status }),
      //     type: 'error'
      //   });
      // });
    },

  },
  created() {
    var _this = this; 

    // 
    // slidesPerView: 5,
    //     initialSlide :2,
    //     centeredSlides: true,
    //     on:{
    //         tap: function () {
    //           _this.imgShow = true;
    //           _this.imgurl = _this.honorList[this.clickedIndex].imgurl
    //             }
    //         },
    _this.swiperOption= {
        slidesPerView:5,
        simulateTouch:true,
        // loop: true,
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
        },
        on:{
            tap: function () {
              console.log('什么情况',_this.bannerList[this.clickedIndex].imgUrl);
              _this.imgShow = true
              _this.currInd = this.clickedIndex
              _this.picurl = _this.bannerList[this.clickedIndex].imgUrl
            }
        },
      },

    // 
    this.timer = setInterval(function() {
      _this.currentTime = //修改数据date
        new Date().getFullYear() +
        "-" +
        _this.appendZero((new Date().getMonth() + 1)) +
        "-" +
        _this.appendZero(new Date().getDate()) +
        " " +
        _this.appendZero(new Date().getHours()) +
        ":" +
        _this.appendZero(new Date().getMinutes()) +
        ":" +
        _this.appendZero(new Date().getSeconds());
    }, 1000);

    
    this.setPreference({ mapType });
  },
  
  mounted() {

    this.swiper.slideTo(4, 1000, false)
    
    // 参数获取
    this.planId =Number(this.$route.query.planId) 
    this.starTime = this.$route.query.starTime
    this.flyDuration = this.$route.query.flyDuration
    this.landTime = this.$route.query.landTime
    // this.weatherTxt = this.$route.query.weather
    this.getWeather()
    // 订阅测试c'c'c'c 
    //  this.submm()
    
    this.getPlanWaypoints(this.plan).then(wp => {
      this.map = waypointsToMapProps(wp)
      console.log('地图MMM',this.map);
    });

    this.processSatus()

    if(this.planId){
      // this.handleOpenFile()
      this.getPlanJobs();
    }

  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
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
.uav-start-fly{
  cursor: pointer;
  position: fixed;
  left: 220px;
  top:28px;
  margin:4px 0 0;
  width:101px;
  height:33px;
  text-align: center;
  background:url('assets/images/btn.png')no-repeat center center;
  background-size: cover;
  line-height:33px;
  font-size: 14px;
  color:#fff;
  text-shadow: 0 0 14px #4AD4FF;
  z-index: 12;
}
.uav-start-stop{
  left: 220px;
  background:url('assets/images/btn-1.png')no-repeat center center;
}
.video-wrap{
  width:100%;
  height:100%;
  position: absolute;
  left:0;
  top:0;
  /* 原0 测试改为9 */
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
.signal-label{
  width:70px;
  flex-shrink: 0;
}
.monitor-icon{
  width:20px;
  flex-shrink: 0;
}
.signal-icon{
  /* width: 18px; */
  flex-shrink:0;
  margin:0 8px 0 2px;
}
.signal-contion{
  width: 18px;
  flex-shrink:0;
  margin:0 8px 0 2px;
}
.signal-con{
  display:flex;
  justify-content: center;
  align-items: flex-end;
}
.signal-one{
  width:2px;
  height:3px;
  margin:0 1px 0 0;
  background-color: #dcdcdc;
  box-shadow: 0 0 2px #c6d4df;
  flex: 1;
}
.signal-two{
  width:2px;
  height:6px;
  margin:0 1px 0 0;
  background-color: #dcdcdc;
  box-shadow: 0 0 2px #c6d4df;
  flex: 1;
}
.signal-three{
  width:2px;
  height:9px;
  margin:0 1px 0 0;
  background-color: #dcdcdc;
  box-shadow: 0 0 2px #c6d4df;
  flex: 1;
}
.signal-four{
  width:2px;
  height:12px;
  margin:0 1px 0 0;
  background-color: #dcdcdc;
  box-shadow: 0 0 2px #c6d4df;
  flex: 1;
}
.signal-five{
  width:2px;
  height:15px;
  margin:0 1px 0 0;
  background-color: #dcdcdc;
  box-shadow: 0 0 2px #c6d4df;
  flex: 1;
}
.signal-on{
  background-color: #a5d0ac;
  box-shadow: 0 0 2px #a5d0ac;
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
.weather-icon-txt{
   font-size:14px;
  color:#fff;
}
/* small map */
.small-map{
  padding:8px;
  width:360px;
  height: 234px;
  position: fixed;
  /* bottom:260px; */
  bottom:196px;
  left: 24px;
  z-index: 2;
  /* background: url('assets/images/bg.png')no-repeat center center rgba(255,255,255,0.1); */
  background: url('assets/images/bg.png')no-repeat center center;
  background-size: contain;
}
.map-coor{
  cursor: pointer;
  margin:0;
  padding-left: 10px;
  font-size: 12px;
  color:#fff;
  font-weight: bold;
  line-height: 22px;
}
.amap{
  width: 360px;
  height: 210px;
}
.overview-small-map{
  height:210px;
  border-radius: 0 10px 0 10px;
}
.video-wrap .amap{
  width: 100%;
  height: 100%;
}
.video-wrap .overview-small-map{
  height:100%;
}
.video-wrap .map__el{
  height:100%;
}
.small-map .fly{
  height: calc(100% - 22px)
}

#container .sd-card__head{
  display:none;
}
#container .el-card__body{
  height:100%;
}
/* 机巢 */
.small-map-rgt{
  position: fixed;
  /* bottom:260px; */
  bottom:196px;
  left:unset;
  right:24px;
}
.small-map-rgt-div{
 height: calc(100% - 22px)
}
.small-map-rgt .fly{
  height: 100%;
}
.small-map .monitor-webrtc__overlay{
  top: 100px;
}
.small-map-rgt .custom{
  /* display: none; */
}
.small-map-rgt .fly .sd-card {
    margin: 0;
}
/* 底部 */
.botm-wrap{
  position: fixed;
  bottom: 0;
  z-index: 1;
  width: 100%;
  /* height: 334px; */
  /* height: 300px; */
  height: 276px;
  background: url('assets/images/bottom.png') no-repeat center top;
  background-size: cover
}
.botm-con{
  display: flex;
}

/* bot-lft */
.btm-lft{
  width: 24%;
  flex-shrink: 0;
  text-align: right;
}
.data{
  padding-top: 134px;
}
.data-li{
  /* width: 42%; */
  width: 26%;
  margin-left: 3%;
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
/* btm-center */
.botm-cont{
  /* width: 58%;
  min-width: 1130px; */
  /* width: 1130px; */
  width: 996px;
  margin: 0 auto;
  flex-grow: 1;
}
/* 流程 */
.process{
  width: 460px;
  height: 30px;
  text-align: center;
  margin: 52px auto 0;
}
.process-star{
  float: left;
  width: 24px;
  height: 24px;
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
  width: 108px;
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
  position:fixed;
  left:21%;
  right:21%;
  bottom:0;
  /* width: 1130px; */
  width: 996px;
  height: 138px;
  margin: 10px auto 0;
  overflow: hidden;
  z-index: 0;
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
  width: 190px!important;
  height: 128px;
  /* opacity: 0.01; */
}
.banner-wrap .img-pic{
  padding:6px 8px;
  /* width: 250px;
  height: 146px; */
  margin: 0 auto;
  /* width: 214px;
  height: 124px; */
  width: 170px;
  height: 99px;
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
/* btm-rgt */
.btm-rgt{
  float: right;
  flex-shrink: 0;
  width: 24%;
  z-index: 3;
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