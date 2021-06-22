<template>
  <div class="suspend-page">
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

    <!-- content -->
    <div class="suspend-body">
      <div class="suspend-left">
        <div class="suspend-item suspend-item2">
          <p class="item-title">距离下次巡检</p>
          <p class="uav-start">立即起飞</p>
          <p class="item-time">12:00:00</p>
          <div class="item-lists clearfix">
            <div class="item-list" v-for="(list, index) in inspectList" :key="index">
              <span class="item-list-lab">{{list.inspectLab}}：</span>
              <div class="item-list-val">
                <em>{{list.inspectVal}}</em><i>{{list.inspectUnit}}</i>
              </div>
            </div>
           
          </div>
        </div>
        <div class="suspend-item suspend-item2">
          <p class="item-title">装备使用状态</p>
          <div :class="[index===0?'equip-item equip-item-bor':'equip-item']" v-for="(equip,index) in equipLIstanbul" :key="index">
            <div class="equip-area">
              <div class="equip-area-cont">
                <img class="equip-area-icon" src="/assets/images/s-icon01.png">
                <span class="equip-area-name">{{equip.area}}</span>
              </div>
            </div>
            <div class="equip-cont">
              <div class="equip-list" v-for="(sta, ind) in equip.statusList" :key="ind">
                <img class="equip-list-icon" :src="sta.statusIcon">
                <p class="equip-list-name">{{sta.statusName}}</p>
              </div>
            </div>
          </div>
          
        </div>
        <div class="suspend-item suspend-item2">
          <p class="item-title">任务执行状态</p>
          <div class="task-table">
            <el-table
              :data="taskData"
              stripe
              style="width: 100%">
              <el-table-column
                prop="type"
                label="设备类型">
              </el-table-column>
              <el-table-column
                prop="pattern"
                label="模式">
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间">
              </el-table-column>
               <el-table-column
                label="任务"
                width="100">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.task" placement="left-start">
                    <p class="task-name">{{scope.row.task}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                prop="startFly"
                label="起飞">
              </el-table-column>
              <el-table-column
                prop="backFly"
                label="返航">
              </el-table-column>
              <el-table-column
                label="飞行进度">
                <template slot-scope="scope">
                  <el-progress :text-inside="true" :stroke-width="10" :percentage="scope.row.flyProgress"></el-progress>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="suspend-right">
        <div class="suspend-right-con">
          <!-- 地图 -->
          <div class="suspend-map" id="map">
            <sd-map
                icon="map-marker"
                class="overview-map"
                title="map.satellite"
                :polylines="polylines"
                :markers="markers"
              ></sd-map>
             <!-- <sd-map
                class="overview-map"
                icon="map-marker"
                title="common.overview"
                :markers="markers"
                :places="places"
                :fit="fit"
                :marker-styling="styling"
                @map-move="handleMove"
                @map-change="handleClose"
                @marker-click="handleMarkerClick"
              >
              </sd-map> -->

          </div>
          <!-- 底部 -->
          <div class="suspend-bottom">
            <div class="suspend-bottom-con">
              <div class="suspend-bottom-left">
                <div class="suspend-btm-title">
                  <img class="suspend-btm-tit-icon" src="/assets/images/icon_camera_line.png">
                  <span class="suspend-btm-tit">机场监控设备</span>
                </div>
                <div class="suspend-btm-small-video">
                  <video-player class="video-player vjs-custom-skin"
                  ref="videoPlayer"
                  :playsinline="true"
                  style="object-fit:fill"
                  :options="playerOptions2"
                  :x5-video-player-fullscreen="true"
                  @pause="onPlayerPause($event)"
                  @play="onPlayerPlay($event)"
                  @fullscreenchange="onFullscreenChange($event)"
                  @click="fullScreen" />
                </div>
              </div>
              <div class="suspend-bottom-mid">
                <div class="airport-wrap">
                  <p class="airport-wrap-title">机场信息</p>
                  <div class="airport-wrap-con">
                    <div class="airport-left">
                      <div class="airport-left-li">
                            <img class="airport-pic" src="/assets/images/airport-icon02.png">
                            <div class="airport-txt">
                              <p class="airport-top-txt">健康运行</p>
                              <span class="airport-btm-txt">系统状态</span>
                            </div>
                      </div>
                      <div class="airport-left-li">
                            <img class="airport-pic" src="/assets/images/airport-icon01.png">
                            <div class="airport-txt">
                              <p class="airport-top-txt">9687小时</p>
                              <span class="airport-btm-txt">系统稳定运行时长</span>
                            </div>
                      </div>

                    </div>
                    <div class="airport-right clearfix">
                      <div class="airport-right-half">
                        <div class="airport-i-flex">
                          <img class="airport-i-icon" src="/assets/images/airport-icon1.png">
                          <span class="airport-i-lab">风向：</span>
                          <span class="airport-i-val">东南风</span>
                        </div>
                      </div>
                      <div class="airport-right-half">
                        <div class="airport-i-flex">
                          <img class="airport-i-icon" src="/assets/images/airport-icon2.png">
                          <span class="airport-i-lab">风速：</span>
                          <span class="airport-i-val">3m/s</span>
                        </div>
                      </div>
                      <div class="airport-right-half">
                        <div class="airport-i-flex">
                          <img class="airport-i-icon" src="/assets/images/airport-icon3.png">
                          <span class="airport-i-lab">工作温度：</span>
                          <span class="airport-i-val">55°C</span>
                        </div>
                      </div>
                      <div class="airport-right-half">
                        <div class="airport-i-flex">
                          <img class="airport-i-icon" src="/assets/images/airport-icon4.png">
                          <span class="airport-i-lab">湿度：</span>
                          <span class="airport-i-val">18%RH</span>
                        </div>
                      </div>
                      <div class="airport-right-half">
                        <div class="airport-i-flex">
                          <img class="airport-i-icon" src="/assets/images/airport-icon5.png">
                          <span class="airport-i-lab">降雨量：</span>
                          <span class="airport-i-val">0.0ml</span>
                        </div>
                      </div>
                      <div class="airport-right-half">
                        <div class="airport-i-flex">
                          <img class="airport-i-icon" src="/assets/images/airport-icon6.png">
                          <span class="airport-i-lab">气压：</span>
                          <span class="airport-i-val">0.01Mpa</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="suspend-bottom-right">
                <div class="suspend-btm-title">
                  <img class="suspend-btm-tit-icon" src="/assets/images/icon_camera_line.png">
                  <span class="suspend-btm-tit">机场监控设备</span>
                </div>
                <div class="suspend-btm-small-video">
                  <video-player class="video-player vjs-custom-skin"
                  ref="videoPlayer"
                  :playsinline="true"
                  style="object-fit:fill"
                  :options="playerOptions1"
                  :x5-video-player-fullscreen="true"
                  @pause="onPlayerPause($event)"
                  @play="onPlayerPlay($event)"
                  @fullscreenchange="onFullscreenChange($event)"
                  @click="fullScreen" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import SdMap from '@/components/map/map.vue';
export default {
  data() {
    return {
      taskData:[
        {
          id:'001',
          type:'精细',
          pattern:'自动',
          createTime:'精细',
          task:'青南油田常规巡检',
          startFly:'准备就绪',
          backFly:'未降落',
          flyProgress:20
        },
        {
          id:'002',
          type:'精细',
          pattern:'自动',
          createTime:'精细',
          task:'青南油田常规巡检',
          startFly:'准备就绪',
          backFly:'未降落',
          flyProgress:20
        },
        {
          id:'003',
         type:'精细',
          pattern:'自动',
          createTime:'精细',
          task:'青南油田常规巡检',
          startFly:'准备就绪',
          backFly:'未降落',
          flyProgress:20
        },
        {
          id:'004',
          type:'精细',
          pattern:'自动',
          createTime:'精细',
          task:'青南油田常规巡检',
          startFly:'准备就绪',
          backFly:'未降落',
          flyProgress:20
        },{
          id:'005',
          type:'精细',
          pattern:'自动',
          createTime:'精细',
          task:'青南油田常规巡检',
          startFly:'准备就绪',
          backFly:'未降落',
          flyProgress:20
        }
      ],
      playerOptions1: {
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
      playerOptions2: {
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
      // 巡检统计
      inspectList:[
        {
          inspectLab:'累计任务数',
          inspectVal:89,
          inspectUnit:'个'
        },
        {
          inspectLab:'累计架次',
          inspectVal:128,
          inspectUnit:'架'
        },
        {
          inspectLab:'累计图像数',
          inspectVal:3258,
          inspectUnit:'张'
        },
        {
          inspectLab:'累计里程',
          inspectVal:24,
          inspectUnit:'km'
        }
      ],
      // 装备状态
      equipLIstanbul:[
        {
          area:'机场',
          statusList:[
            {
              statusIcon:'/assets/images/sl-img01.png',
              statusName:'电源正常',
            },
            {
              statusIcon:'/assets/images/sl-img02.png',
              statusName:'网络正常',
            },
            {
              statusIcon:'/assets/images/sl-img03.png',
              statusName:'起降正常',
            },
            {
               statusIcon:'/assets/images/sl-img04.png',
              statusName:'充电正常'
            }
          ]
        },
        {
          area:'无人机',
          statusList:[
            {
              statusIcon:'/assets/images/sl-img05.png',
              statusName:'关机',
            },
            {
              statusIcon:'/assets/images/sl-img06.png',
              statusName:'飞控',
            },
            {
              statusIcon:'/assets/images/sl-img01.png',
              statusName:'电源充足',
            },
            {
               statusIcon:'/assets/images/sl-img07.png',
              statusName:'吊舱'
            }
          ]
        }
      ],
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
    ...mapState([
      'preference'
    ])
  },
  watch: {
   
  },
  created() {
    this.setPreference({ mapType });
    
  },
  mounted () {
  },
  methods: {
    fullScreen(){},
    // 地图
    ...mapActions([
      'setPreference'
    ]),
    handleMove() {},
    handleMarkerClick(id, el) {},
    handleClose() {},
   
  },
  
}
</script>


<style>
/* 背景图加载有问题 */
.overview-map {
  margin: 0;
  height: 1016px;
}
.overview-map .el-card__body {
  height: calc(100vh + 290px);
}
.overview-map .map__el {
  height: 100%;
}


.suspend-page{
  width:1920px;
  /* height:100vh; */
  background: url('assets/images/s-bg.png')no-repeat center center;
  background-size: cover;
  position: relative;
  overflow: hidden;
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
/* content */
.suspend-body{
  position: relative;
  margin-top:86px;
  display:flex;
  z-index:4;
}
.suspend-left{
  width:656px;
  margin-left: 20px;
  flex-shrink: 0;
}
.suspend-item{
  display: block;
  padding:10px 15px 0;
}
.suspend-item1{
  height:351px;
  background:url('assets/images/s-l-bg1.png')no-repeat center top;
  background-size:cover;
}
.suspend-item2{
  height:336px;
  background:url('assets/images/s-l-bg1.png')no-repeat center top;
  background-size:cover;
}
.item-title{
  margin:0;
  padding-bottom: 5px;
  padding-left:20px;
  font-size:16px;
  color:#fff;
  font-weight: bold;
  background:url('assets/images/tittle.png')no-repeat center bottom;
  background-size: 100%;
}
/* one */
.uav-start{
  cursor: pointer;
  float: right;
  margin:4px 0;
  width:101px;
  height:33px;
  text-align: center;
  background:url('assets/images/btn.png')no-repeat center center;
  background-size: cover;
  line-height:33px;
  font-size: 14px;
  color:#fff;
  text-shadow: 0 0 14px #4AD4FF;
}
.item-time{
  font-size:100px;
  color:#fff;
  display:block;
  font-weight:bold;
  text-align: center;
  margin:40px 0 0;
  text-shadow: 0 0 14px #4AD4FF;
}
.item-lists{
  padding:0 40px;
  margin-top:10px;
}
.item-list{
  padding-left:5%;
  width:20%;
  float:left;
}
.item-list-lab{
  font-size: 14px;
  color:#fff;
  line-height:22px;
}
.item-list-val{}
.item-list-val em{
  font-size:24px;
  color:#32FCCD;
  font-style: normal;
  text-shadow: 0 0 14px #4AD4FF;
}
.item-list-val i{
  font-size:14px;
  color:rgba(255,255,255,0.6);
  font-style:normal;
}
.equip-item{
  display:flex;
  align-items: center;
  margin:10px 0 0;
  padding-bottom:15px;
}
.equip-item-bor{
  border-bottom:1px solid #fff;
  border-image: -webkit-linear-gradient(90deg, rgba(255,255,255,0.00) 0%,#00BBF2 60%, rgba(255,255,255,0.00) 99%) 2 2 2 2;
  border-image: -moz-linear-gradient(90deg, rgba(255,255,255,0.00) 0%,#00BBF2 60%, rgba(255,255,255,0.00) 99%) 2 2 2 2;
  border-image: linear-gradient(90deg, rgba(255,255,255,0.00) 0%,#00BBF2 60%, rgba(255,255,255,0.00) 99%) 2 2 2 2;
}
.equip-area{
  flex-shrink: 0;
  width:100px;
  padding-left:20px;
}
.equip-area-cont{
  display:flex;
  align-items: center;
}
.equip-area-icon{
  width:29px;
  height:20px;
  flex-shrink: 0;
}
.equip-area-name{
  flex-grow: 1;
  font-size:14px;
  color:#fff;
}
.equip-cont{
  flex-grow: 1;
}
.equip-list{
  width:25%;
  float:left;
  text-align: center;
}
.equip-list-icon{
  width:63px;
  height:63px;
  margin:0 auto;
}
.equip-list-name{
  font-size:14px;
  color:#B5E4FF;
  text-shadow: 0 0 14px #4AD4FF;
}
.task-name{
  display:block;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.task-table{
  height:280px;
}
/* 覆盖 */
.el-table td,.el-table th{
  padding:0!important;
}
.el-table th, .el-table tr,.el-table, .el-table__expanded-cell{
  background: transparent;
}
.el-table td, .el-table th.is-leaf{
  border:0;
}
.el-table .cell{
  color:#fff;
}
.el-table th>.cell{
  color:rgba(255,255,255,0.6);
  font-weight: normal;
}
.el-table--striped .el-table__body tr.el-table__row--striped td{
  background: rgba(90,146,255,0.1);
}
.el-table--striped .el-table__body tr.el-table__row:hover td{
   background: rgba(90,146,255,0.2);
}
.el-progress-bar__outer{
  background-color: rgba(0,0,0,0.6);
}
.el-progress-bar__inner{
  border-radius: 3px;
  background: -webkit-linear-gradient(right,#1385C5,#84E1FF);
  background: -o-linear-gradient(right,#1385C5,#84E1FF);
  background: -moz-linear-gradient(right,#1385C5,#84E1FF);
  background: -mos-linear-gradient(right,#1385C5,#84E1FF);
  background: linear-gradient(right,#1385C5,#84E1FF);
}
.el-progress-bar__outer{
  border-radius: 3px;
}
.el-progress-bar__innerText{
  display: none;
}

.suspend-right{
  flex-grow: 1;
  width:1210px;
  margin-left: 20px;
  background: url('assets/images/s-r-bg.png')no-repeat center top;
  background-size:100% 100%;
}
.suspend-right-con{
  position: relative;
  padding:10px;
  height:calc(100% - 20px)
}
.suspend-map{
  width:100%;
  height:100%;
}
.suspend-bottom{
  position: absolute;
  left:0;
  bottom:0;
  margin: 0 25px 10px;
  width:1172px;
  height:246px;
  background:url('assets/images/sr-bg.png')no-repeat center top;
  background-size:100%;
}
.suspend-bottom-con{
  display:flex;
}
.suspend-bottom-left{
  flex-shrink: 0;
  width:295px;
  margin-left:10px;
}
.suspend-bottom-mid{
  flex-grow:1;
  padding-top:32px;
}
.suspend-bottom-right{
  flex-shrink: 0;
  width:295px;
  margin-right:10px;
}
.suspend-btm-title{
  display:flex;
  padding-top:8px;
}
.suspend-bottom-right .suspend-btm-title{
  justify-content: flex-end;
  padding-right:2px;
}
.suspend-btm-tit-icon{
  flex-shrink: 0;
  width:26px;
  height:24px;
}
.suspend-btm-tit{
  font-size:14px;
  color:#fff;
  padding-left:4px;
}
.suspend-btm-small-video{
  width:295px;
  height:197px;
  background:#000;
}
.airport-wrap{
  margin:0 5px;
  height:100%;
  border-left:1px solid #fff;
  border-right:1px solid #fff;
  border-image: -webkit-linear-gradient(-180deg, rgba(255,255,255,0.00) 0%,#00BBF2 60%, rgba(255,255,255,0.00) 99%) 2 2 2 2;
  border-image: -moz-linear-gradient(-180deg, rgba(255,255,255,0.00) 0%,#00BBF2 60%, rgba(255,255,255,0.00) 99%) 2 2 2 2;
  border-image: linear-gradient(-180deg, rgba(255,255,255,0.00) 0%,#00BBF2 60%, rgba(255,255,255,0.00) 99%) 2 2 2 2;

}
.airport-wrap-title{
  margin:2px 0 0 ;
  font-size: 16px;
  color:#fff;
  text-align:center;
  text-shadow: 0 0 14px #4AD4FF;
}
.airport-wrap-con{
   display:flex;
}
.airport-left{
  width:186px;
  flex-shrink: 0;
}
.airport-right{
  flex-grow:1;
  padding-top: 40px;
  padding-left: 15px;
}
.airport-left-li{
  display:flex;
  align-items: center;
}
.airport-pic{
  width:89px;
  height:88px;
  flex-shrink: 0;
}
.airport-txt{
  flex-grow:1;
}
.airport-top-txt{
  font-size:16px;
  color:#AAFFEB;
  text-shadow: 0 0 14px #4AD4FF;
  margin:4px 0 6px;
}
.airport-btm-txt{
  font-size:12px;
  color:#fff;
  margin:0 0 4px;
}
.airport-right-half{
  width:50%;
  float: left;
  height:40px;
}
.airport-i-flex{
  display:flex;
  align-items: center;
}
.airport-i-icon{
  width:25px;
  height:24px;
  flex-shrink: 0;
}
.airport-i-lab{
  flex-shrink: 0;
  padding-left:2px;
  padding-right:2px;
  font-size:14px;
  color:#B5E4FF;
}
.airport-i-val{
  flex-grow:1;
  font-size:14px;
  color:#fff;
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
