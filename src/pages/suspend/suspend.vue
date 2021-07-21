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
        <span>当前巡检：</span><em>{{duration}}</em>
      </div>
    </div>

    <!-- 右侧时间 -->
    <div class="time-rgt">
      <div class="time-cont">
        <span class="time-date">{{ parseTime(currentDate,'{y}-{m}-{d} {h}:{i}:{s} 星期{a}') }}</span>
        <!-- <img class="weather-icon" src="/assets/images/icon_sun.png"> -->
        <span class="weather-icon-txt">{{weather.text}}</span>
      </div>
    </div>

    <!-- content -->
    <div class="suspend-body">
      <div class="suspend-left">
        <div>
          
        <div class="suspend-item suspend-item2">
          <p class="item-title">距离下次巡检</p>
          <!-- v-if="isRunning" -->
          <!-- <p class="uav-start"  @click="handleExecute" >立即起飞</p> -->
          <p class="uav-start" v-if="!isRunning"  @click="handleExecute(1)" >立即起飞</p>
          <p class="uav-start" v-else  @click="handleExecute(0)" >立即停飞</p>
          <p class="uav-start"  @click="ces" >测试跳转页面</p>
       
          <p class="item-time">
            <!-- {{hour}}:{{min}}:{{second}} -->
            {{countSecond}}
          </p>
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
              height="250"
              stripe
              style="width: 100%">
              <el-table-column
                prop="name"
                label="任务名称">
              </el-table-column>
              <el-table-column
                prop="droneName"
                label="执飞无人机">
              </el-table-column>
              
              <!-- <el-table-column
                prop="createTime"
                label="创建时间">
              </el-table-column> -->
              <el-table-column
                prop="description"
                label="执行时间">
              </el-table-column>
               <!-- <el-table-column
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
              </el-table-column> -->
              <el-table-column
                label="飞行进度">
                <template slot-scope="scope">
                  <el-progress :text-inside="true" :stroke-width="10" :percentage="scope.row.flyProcess"></el-progress>
                </template>
              </el-table-column>
              <!-- <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="small" icon="el-icon-edit" @click="handleExecute(scope.row)">执行任务</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <!-- <el-pagination
              small
              layout="prev, pager, next"
              :total="50">
            </el-pagination> -->
          </div>
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
                  <!-- <video-player class="video-player vjs-custom-skin"
                  ref="videoPlayer"
                  :playsinline="true"
                  style="object-fit:fill"
                  :options="playerOptions2"
                  :x5-video-player-fullscreen="true"
                  @pause="onPlayerPause($event)"
                  @play="onPlayerPlay($event)"
                  @fullscreenchange="onFullscreenChange($event)"
                  @click="fullScreen" /> -->
                  <template v-for="{ point, compo, key } of points">
                    <component
                      :is="compo"
                      :key="key"
                      :info="nodeObj.info"
                      :point="point"
                      :status="nodeObj.status"
                      :msg="nodeObj.msg"
                    ></component>
                  </template>
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
                          <span class="airport-i-val">{{selectedNodeDepot.msg.weather.WD}}</span>
                        </div>
                      </div>
                      <div class="airport-right-half">
                        <div class="airport-i-flex">
                          <img class="airport-i-icon" src="/assets/images/airport-icon2.png">
                          <span class="airport-i-lab">风速：</span>
                          <span class="airport-i-val">{{selectedNodeDepot.msg.weather.WS}}m/s</span>
                        </div>
                      </div>
                      <div class="airport-right-half">
                        <div class="airport-i-flex">
                          <img class="airport-i-icon" src="/assets/images/airport-icon3.png">
                          <span class="airport-i-lab">工作温度：</span>
                          <span class="airport-i-val">{{weather.temp}}°C</span>
                        </div>
                      </div>
                      <div class="airport-right-half">
                        <div class="airport-i-flex">
                          <img class="airport-i-icon" src="/assets/images/airport-icon4.png">
                          <span class="airport-i-lab">湿度：</span>
                          <span class="airport-i-val">{{weather.humidity}}%</span>
                        </div>
                      </div>
                      <div class="airport-right-half">
                        <div class="airport-i-flex">
                          <img class="airport-i-icon" src="/assets/images/airport-icon5.png">
                          <span class="airport-i-lab">降雨量：</span>
                          <template v-if="minutely.length == 0">
                            <span class="airport-i-val">0.0ml</span>
                          </template>
                          <template v-else>
                            <span class="airport-i-val">不为0{{minutely}}</span>
                          </template>
                        </div>
                      </div>
                      <div class="airport-right-half">
                        <div class="airport-i-flex">
                          <img class="airport-i-icon" src="/assets/images/airport-icon6.png">
                          <span class="airport-i-lab">天气：</span>
                          <span class="airport-i-val">{{weather.text}}</span>
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
                  <!-- <video-player class="video-player vjs-custom-skin"
                  ref="videoPlayer"
                  :playsinline="true"
                  style="object-fit:fill"
                  :options="playerOptions1"
                  :x5-video-player-fullscreen="true"
                  @pause="onPlayerPause($event)"
                  @play="onPlayerPlay($event)"
                  @fullscreenchange="onFullscreenChange($event)"
                  @click="fullScreen" /> -->
                  <template v-for="{ point, compo, key } of points">
                    <component
                      :is="compo"
                      :key="key"
                      :info="nodeObj.info"
                      :point="point"
                      :status="nodeObj.status"
                      :msg="nodeObj.msg"
                    ></component>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!--  -->
    <sd-plan-dialog ref="planDialog" :planId="planId"  @changeForm="getForm"></sd-plan-dialog>
    
    <!--  -->
    <div class="dialog-black" v-show="dialogShow" @click="handleFlyBlock"></div>
    <div class="dialog-main" v-show="dialogShow">
      <h4 class="dialog-fly-name">青南{{flyPlan.droneName}}巡检无人机</h4>
      <img class="dialog-fly-drone-pic" src="/assets/images/drone-pic.png">
      <template v-if="loadingData">
        <div class="dialog-load">检测准备中...</div>
      </template>
      <template v-else>
      <p class="dialog-fly-txt">
        <span class="dialog-fly-span" v-for="(oneD,ind) in weatherItem" :key="ind">
          <i>{{oneD.name}}:</i>
          <template v-if="oneD.level == 'success'">
           <em class="success">{{oneD.message}}</em>
          </template>
          <template v-else-if="oneD.level == 'warning'">
           <em class="warning">{{oneD.message}}</em>
          </template>
          <template v-else-if="oneD.level == 'danger'">
           <em class="danger">{{oneD.message}}</em>
          </template>
          <template v-else>
           <em>{{oneD.message}}</em>
          </template>
          
        </span>
      </p>
      <p class="dialog-fly-txt">
        <span class="dialog-fly-span" v-for="(twoD,index) in flyItem" :key="index">
          <i>{{twoD.name}}:</i>
          <template v-if="twoD.level == 'success'">
           <em class="success">{{twoD.message}}</em>
          </template>
          <template v-else-if="twoD.level == 'warning'">
           <em class="warning">{{twoD.message}}</em>
          </template>
          <template v-else-if="twoD.level == 'danger'">
           <em class="danger">{{twoD.message}}</em>
          </template>
          <template v-else>
           <em>{{twoD.message}}</em>
          </template>
        </span>
      </p>
      <p class="dialog-fly-txt dialog-fly-txt2">是否启动？</p>
      <div class="dialog-fly-btns">
        <p class="dialog-fly-btn dialog-fly-cancel" @click="handleFlyCancel">取消任务</p>
        <p class="dialog-fly-btn dialog-fly-sure" @click="handleFlySure">开始飞行</p>
      </div>
      </template>
    </div>

  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import SdMap from '@/components/map/map.vue';
import { runPlanJob, indexPlan, getPlanJobs, cancelPlanJob } from '@/api/super-dock';

import { weather, minutely, warning } from '@/api/heweather';

import { MutationTypes as EXE } from '@/store/modules/execute';

import PlanDialog from '@/components/plan-dialog/plan-dialog.vue';
import { PlanDialogLevelClass } from '@/constants/plan-dialog-level-class';

import MqttClient from '@/api/mqtt';

import Monitor from '@/components/monitor/video.vue';

let dateTime = new Date();

const CompoName = {
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
  [Monitor.name]: 2
};

export default {
  data() {
    return {
      taskData:[],
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
       // 当前日期
      currentDate:dateTime,
      // 巡检倒计时
      day:'',
      hour:'',
      min:'',
      second:'',
      countSecond:'',
      endDate:'', //结束日期
      // 巡检统计
      inspectList:[
        {
          inspectLab:'累计任务数',
          inspectVal:0,
          inspectUnit:'个'
        },
        {
          inspectLab:'累计架次',
          inspectVal:0,
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
              statusName:'舱门',
            },
            {
              statusIcon:'/assets/images/sl-img02.png',
              statusName:'固定器',
            },
            {
              statusIcon:'/assets/images/sl-img04.png',
              statusName:'充电器',
            },
            {
              statusIcon:'/assets/images/sl-img03.png',
              statusName:'通讯'
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
      polylines:[],
      // mapType
      mapType: 'sd-map-mapbox',
      // 架次总和
      plansSum:0,
      // 天气
      weather: {},
      minutely: [],
      // 要执行的任务
      onTask:[],
      flyPlan:{},
      // 
      planDialog: {
        id: -1
      },
      // 
      // selected:{}
      allItem:[],
      weatherItem:[],
      flyItem:[],
      // 
      dialogShow: false,
      loadingData: true,
      lastFlyObj:{},
      // 预计飞行时长
      planFlyDuration:'',
      // 起飞时间
      startTime:'',
      // 返航时间
      landTime:'',
      // 回巢时间
      flyDuration:'',
      // 飞行状态
      flyStatus:0,
      planId:0

    }
  },
  components: {
    [SdMap.name]: SdMap,
    [PlanDialog.name]: PlanDialog,
    [Monitor.name]: Monitor
  },
  computed: {
     ...mapState({
      /**
       * @param {SDWC.State} state
       * @returns {SDWC.PlanRunningContent}
       */
      runningContent(state) {
        /** @type {SDWC.PlanRunning} */
        const running = state.plan.running.find(r => r.id === this.flyPlan.id);
        return running ? running.running : null;
      },
      // 
      isHasRunning(state) {
        let running = null
        this.plan.info.forEach(item => {
          if(state.plan.running.find(r => r.id === item.id)){
            running = state.plan.running[0].running
          }else{
            running = null
          }
        })
        
        return running;
      },
    }),
    ...mapState([
      'node',
      'plan',
      'preference',
      'execute'
    ]),
    ...mapGetters([
      'depots',
      'drones'
    ]),
    // 当前巡检 = 时长
    droneVal() {
      return this.drones[0].info.id
    },
    selectedNode() {
      return this.node.find(node => node.info.id === this.droneVal);
    },
    duration() {
      const { time } = this.selectedNode.msg.drone_status;
      const options = {
        timeZone: 'UTC',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
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
    // 机场id
    depotsId() {
      let depotsOlny = undefined
      for (let d of this.depots) {
        depotsOlny = d.info.id
      }
      return depotsOlny;
    },
    // 当前nodeObj
    nodeObj() {
      const nodeId = this.depotsId;
      let node = this.node.find(node => node.info.id === nodeId);
      return node
    },
    // 无人机信息
    selectedNodeDrons() {
      return this.node.find(node => node.info.id === this.droneId);
    },
    // 机场信息
    selectedNodeDepot() {
      return this.node.find(node => node.info.id === this.depotsId);
    },
    // 地图坐标
    depotMarkers() {
      const markers = [];
      for (const d of this.depots) {
        const { code, status } = d.status;
        if (code === 0) {
          markers.push({
            type: 'depot',
            id: d.info.id,
            name: d.info.name,
            position: {
              lng: +status.lng,
              lat: +status.lat,
            }
          });
        }
      }
      return markers;
    },
    // 机场-markers
    markers() {
      return [...this.depotMarkers];
    },
    // 
    isRunning() {
      return this.runningContent !== null;
    },
    //
    hasRunning() {
       return this.isHasRunning !== null;
    },
    // 视频
    points() {
      let i = 0;
      const nodeId = this.depotsId;
      let node = this.node.find(node => node.info.id === nodeId);
      return this.nodeObj.info.points.map(point => {
        const { id, point_type_name } = point;
        const compo = CompoName[point_type_name] || '';
        const key = `${nodeId}-${id}-${point_type_name}-${i++}`;
        return { point, compo, key };
      }).sort((a, b) => CompoOrder[a.compo] - CompoOrder[b.compo]);
    },

  },
  watch: {
    countSecond: {
      handler(newValue,oldValue) {
        // 监听倒计时
        let djs = newValue.split(':')
        console.log('监听倒计时数组,',djs);
        if(djs[0] == '00'){
          if(djs[1]=='00'){
            if(djs[2]=='00'){
            this.handleExecute(1)
            // this.ces()
           }
          }
        }
        
        //newValue 改变后的数据
        //oldValue  改变前的数据
      }
      //,deep: true
    }
  },
  created() {
    this.setPreference({ mapType });
  },
  mounted () {
    this.flyStatus = this.$route.query.flyStatus
    // this.countTime()

   



    this.getIndexPlan()
    // 
    this.getEquipList()
    this.getWeather()
    
  },
  methods: {
    fullScreen(){},
    
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
    handleMove() {},
    handleMarkerClick(id, el) {},
    handleClose() {},
    // 
    
    // 任务列表
    async getIndexPlan(){
      // 获取任务列
      const res = await indexPlan();
      console.log('暂停页面-获取任务列', res)
      let taskList = res
      taskList.forEach(item => {
        if(typeof Number(item.description) === 'number'  && !isNaN(Number(item.description))){
          item.description = Number(item.description).toFixed(2)
        } else{
          item.description = 0.00
        }
      })
      this.taskData = taskList
      this.inspectList[0].inspectVal = res.length

      // 任务执行历史id
      this.taskData.forEach(item => {
        this.getPlanJobs(item.id)
      })


      // 执行任务获取
      this.gtOnTask(taskList)

      
      // 无人机名称
      this.taskData.forEach(item => {
        let nodeDrone = this.node.find(node => node.info.id === item.node_id)
        if(nodeDrone !== undefined){
          item.droneName = nodeDrone.info.name
        }
      })
      

     
    },
    // 任务执行历史plans总和
    async getPlanJobs(planId) {
      let res = await getPlanJobs(planId)
      this.plansSum += res.length
      this.inspectList[1].inspectVal = this.plansSum
    },
    // 装备使用装填
    getEquipList() {
      // 机场 selectedNodeDepot
      switch ( this.selectedNodeDepot.msg.depot_status.door )
      {
        case 'closed':
          this.equipLIstanbul[0].statusList[0].statusName ='舱门关闭';
          break;
        default:
          this.equipLIstanbul[0].statusList[0].statusName ='舱门开启';
          break;
      }
      switch ( this.selectedNodeDepot.msg.depot_status.fix )
      {
        case 'closed':
          this.equipLIstanbul[0].statusList[1].statusName ='固定器关闭';
          break;
        default:
          this.equipLIstanbul[0].statusList[1].statusName ='固定器开启';
          break;
      }
      switch ( this.selectedNodeDepot.msg.charger.status )
      {
        case 'error':
          this.equipLIstanbul[0].statusList[2].statusName ='充电器异常';
          break;
        default:
          this.equipLIstanbul[0].statusList[2].statusName ='充电器正常';
          break;
      }
      // TODO 字段通讯不确定
      switch ( this.selectedNodeDepot.msg.depot_status.status )
      {
        case 'error':
          this.equipLIstanbul[0].statusList[3].statusName ='通讯异常';
          break;
        default:
          this.equipLIstanbul[0].statusList[3].statusName ='通讯正常';
          break;
      }
      // 无人机 selectedNodeDrons
      // TODO 字段开机关机不确定
      switch ( this.selectedNodeDepot.msg.depot_status.status )
      {
        case 'error':
          this.equipLIstanbul[1].statusList[0].statusName ='关机';
          break;
        default:
          this.equipLIstanbul[1].statusList[0].statusName ='开机';
          break;
      }
      if(this.selectedNodeDepot.msg.battery.remain > 90){
        this.equipLIstanbul[1].statusList[1].statusName ='电量充足';
      } else{
        this.equipLIstanbul[1].statusList[1].statusName ='电量不足';
      }
      
      this.equipLIstanbul[1].statusList[2].statusName ='信号' + this.selectedNodeDepot.msg.drone_status.signal ;
      // this.equipLIstanbul[1].statusList[3].statusName ='卫星'  + this.selectedNodeDepot.msg.drone_status.gps.satcount + '星' + this.selectedNodeDepot.msg.drone_status.gps.type ;
      this.equipLIstanbul[1].statusList[3].statusName ='卫星'  + this.selectedNodeDepot.msg.drone_status.gps.satcount + '星';
       
      //  
    },
    // 天气
    getWeather() {
      const { lng, lat } = this.selectedNodeDepot.status.status;
      return Promise.all([
        minutely(lng, lat).then(data => this.minutely = data.minutely || []),
        weather(lng, lat).then(data => this.weather = data.now || {}),
        warning(lng, lat).then(data => this.alert = data.warning || [])
      ]);
    },
    // 秒=>时分秒
    formatSeconds(value) {
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        // alert(theTime);
        if(theTime > 60) {
          theTime1 = parseInt(theTime/60);
          theTime = parseInt(theTime%60);
          // alert(theTime1+"-"+theTime);
          if(theTime1 > 60) {
              theTime2 = parseInt(theTime1/60);
              theTime1 = parseInt(theTime1%60);
          }
        }
        
        // +"秒"
        // var result = ""+parseInt(theTime);
        if(parseInt(theTime)<10){
          var result = ""+"0"+parseInt(theTime);
        } else{
           var result = ""+parseInt(theTime);
        }
        if(theTime1 > 0) {
          // 分
          if(parseInt(theTime1)<10){
            result = ""+"0"+parseInt(theTime1)+":"+result;
          } else{
            result = ""+parseInt(theTime1)+":"+result;
          }
        }
        if(theTime2 > 0) {
          // 小时
          if(parseInt(theTime2)<10){
            result = ""+"0"+parseInt(theTime2)+":"+result;
          } else{
            result = ""+parseInt(theTime2)+":"+result;
          }
        }
        return result;
    },
    // 去除前面补零
    removeZero(val){
      let str = val.toString()
      let fistChar = str.substr(0, 1)
      let fistNum = Number(fistChar)
      if(fistNum == 0){
        return Number(str.substr(1, 2))
      }else{
        return Number(str)
      }
    },
    // 获取执行任务
    gtOnTask(dataList){
      
      // 加进度参数
      dataList.forEach(itm => {
        itm.flyProcess = 0
      })

      // 当前时间=>秒
      let execteTime = this.parseTime(this.currentDate,'{h}:{i}:{s}')
      var execteArr = execteTime.toString().split(':');
      let currentSecond = this.removeZero(execteArr[0])*3600 + this.removeZero(execteArr[1])*60 + this.removeZero(execteArr[2])

      let index = 0
      // 将要执行的任务
      dataList.forEach((item, ind)=> {
        item.flyProcess = 100
        // 描述中的飞行时间
        if(item.description !== 0){
          // 执行到几点=>秒
          let doArr = (item.description).toString().split('.')
          let doSecond = this.removeZero(doArr[0])*3600 +  this.removeZero(doArr[1])*60
          
          // TODO 首先判断是否有正在执行的任务
          // 无执行状态

          // 获取要执行的任务
          if((doSecond > currentSecond) && (this.onTask.length == 0)) {
            index = ind
            this.onTask.push(item)
            return false;
          }
          
        }
        
      })

      dataList.forEach((itmm, indd) => {
        // 是否有正在执行的项目
        // console.log('是否有正在执行的项目',this.hasRunning)
        if(!this.hasRunning){
          if(indd > index){
            itmm.flyProcess = 0
          }else if(indd == index){
            switch(this.flyStatus) {
              case '1':
                itmm.flyProcess = 25
                break;
              case '2':
                itmm.flyProcess = 50
                break;
              case '3':
                itmm.flyProcess = 75
                break;
              case '4':
                itmm.flyProcess = 100
                break;
              default:
                itmm.flyProcess = 0
            } 
          }
        } else{
          if(indd < (index-1)){
            itmm.flyProcess = 100
          } else{
            itmm.flyProcess = 0
          }
        }
        
        
      })
      
      // 要执行的任务==this.flyPlan
      this.flyPlan = this.onTask[0]
      this.planId = this.flyPlan.id
      let endArr = (this.onTask[0].description).toString().split('.')
      let endSecond = this.removeZero(endArr[0])*3600 +  this.removeZero(endArr[1])*60
      
      // 结束时间=>年月日 时:分:秒
      this.endDate = this.parseTime(this.currentDate,'{y}-{m}-{d}') +' '+ endArr[0].toString() + ':' + endArr[1].toString() + ':00' 
      // 若未点击执行任务,则结束日期即倒计时到达日期为下达任务时间
      this.$store.commit(EXE.SET_EXECUTE, this.endDate)

      // 返航时间
      let hmsSecond = endSecond -(2*60)
      this.landTime = this.parseTime((new Date()),'{y}-{m}-{d}') + ' ' + this.formatSeconds(hmsSecond)
     

      // 倒计时
      this.countTime()
    },
    // 倒计时
    countTime() {
      let now = new Date().getTime(); // 获取当前时间
      let endDate = new Date(this.endDate); // 设置截止时间
      let end = Number(endDate);
      //let endDate = new Date(this.assistActivityEndTime); // this.assistActivityEndTime需要倒计时的日期
      let leftTime = end - now;
      // 定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        // 天
        // this.day = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        // let dayh = this.day * 24
        // 时
        let h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
        h = h;
        this.hour = h < 10 ? "0" + h : h;
        // 分
        let m = Math.floor((leftTime / 1000 / 60) % 60);
        this.min = m < 10 ? "0" + m : m;
        // 秒
        let s = Math.floor((leftTime / 1000) % 60);
        this.second = s < 10 ? "0" + s : s;
        this.countSecond = this.hour+':'+this.min+':'+this.second 
      } else {
        this.day = 0;
        this.hour = "00";
        this.min = "00";
        this.second = "00";
        this.countSecond = this.hour+':'+this.min+':'+this.second 
        
      }
      // 等于0的时候不调用
      if (
        Number(this.day) === 0 &&
        Number(this.hour) === 0 &&
        Number(this.min) === 0 &&
        Number(this.second) === 0
      ) {
        this.flag = false;
        this.$route.query.count = 4;
        // 执行飞行任务

        return;
      } else {
        // 递归每秒调用countTime方法，显示动态时间效果,
        setTimeout(this.countTime, 1000);
        this.flag = true;
      }
    },
    // 获取开始执行任务时间
    handleExecute(status) {
      // 点击立即起飞  获取下达任务-日期
      let execteTime = this.parseTime((new Date()),'{y}-{m}-{d}') + ' ' + this.parseTime(this.currentDate,'{h}:{i}:{s}')
      this.$store.commit(EXE.SET_EXECUTE, execteTime)

      if(status == 1){
        // 起飞
        this.handleRun()
      } else{
        // 停飞
        this.handleStop()
      }
    },
    // 起飞
    handleRun() {
      // this.$nextTick(() => this.$refs.planDialog.open());
      this.$nextTick(() => this.$refs.planDialog.close());
      runPlanJob(this.flyPlan.id).catch(() => { /* noop */ });
      // 检测弹框
      if(this.isRunning){
        this.dialogShow = true
        this.loadingData = true
      } else{
        this.dialogShow = false
        this.loadingData = true
      }

    },
    // 停飞
    handleStop() {
      this.allItem = []
      this.weatherItem = []
      this.flyItem = []
      this.$nextTick(() => this.$refs.planDialog.close());
      if (!this.isRunning) return;
      /**
       * mutate element-ui's Notification object
       * @see https://github.com/ElemeFE/element/blob/v2.8.2/packages/notification/src/main.vue
       */
      const n = this.$notify({
        offset: 50,
        duration: 0,
        type: 'info',
        title: this.flyPlan.name,
        message: this.$t('plan.view.pending'),
      });
      cancelPlanJob(this.flyPlan.id, this.runningContent.id).then(() => {
        Object.assign(n.$data, {
          message: this.$t('plan.view.stop_run'),
          type: 'warning',
          duration: 2000
        });
        n.startTimer();
      }).catch(e => {
        Object.assign(n.$data, {
          message: this.$t('plan.view.stop_fail', { code: e.status }),
          type: 'error'
        });
      });
    },
    //
    getForm(item) {
      let sef = this
      sef.$nextTick(() => this.$refs.planDialog.close());
      // 每步获取的信息
      console.log('暂停页面-每步获取的信息', item)
      
      if('dialog' in item){
        // 自动执行下一步
        if(item.dialog.buttons[1].message == "yes" || ((item.dialog.buttons[1].message == "confirm")&&(item.dialog.buttons[1].name == "下一步"))){
          sef.$nextTick(() => this.$refs.planDialog.close());
          MqttClient.mqtt.publish(`plans/${this.flyPlan.id}/term`, item.dialog.buttons[1].message);
          
          // 天气获取
          if('items' in item.dialog){
            if(item.dialog.items.length !== 0){
              this.weatherItem = item.dialog.items;
            }
            console.log('暂停页面-所有天气item:', this.weatherItem)
          }
        } 

        // 航点检测获取
        if(item.dialog.buttons[1].name == "↑开始起飞↑"){
          sef.$nextTick(() => this.$refs.planDialog.open());
          // sef.$nextTick(() => this.$refs.planDialog.close());
          // 
          if('items' in item.dialog){
            if(item.dialog.items.length !== 0){
              this.flyItem = item.dialog.items;
              this.flyItem.forEach(itf => {
                itf.name
                if(itf.name == "预计时间"){
                  this.planFlyDuration = itf.message
                }
              })
            }
          }
          // 获取起飞前对象为了获取按钮信息
          this.lastFlyObj = item
          console.log('暂停页面-起飞前的对象', this.lastFlyObj)
        }
      }

      if(this.flyItem.length !== 0){
        // 弹框
        if(this.isRunning){
          this.dialogShow = true
          this.loadingData = false
        } else{
          this.dialogShow = false
          this.loadingData = true
        }
      }
      
    },
    handleFlyBlock(){
      this.dialogShow = false
    },
    handleFlyCancel(){
      this.dialogShow = false
      let message = this.lastFlyObj.dialog.buttons[0].message
      MqttClient.mqtt.publish(`plans/${this.flyPlan.id}/term`, message);
    },
    handleFlySure(){
      this.startTime = this.parseTime((new Date()),'{y}-{m}-{d} {h}:{i}:{s}')

      // 开始飞行
      let message = this.lastFlyObj.dialog.buttons[1].message
      MqttClient.mqtt.publish(`plans/${this.flyPlan.id}/term`, message);

      // 取消任务(避免真的飞行)
      // let message = this.lastFlyObj.dialog.buttons[0].message
      // MqttClient.mqtt.publish(`plans/${this.flyPlan.id}/term`, message);

      // 2021-07-18新增---start   planFlyDuration
      // 获取当前起飞时间（时分秒）转换成秒
      let sStart = this.parseTime((new Date()),'{h}:{i}:{s}')
      let sStartArr = sStart.toString().split(':')
      let sStartSecond = this.removeZero(sStartArr[0])*3600 +  this.removeZero(sStartArr[1])*60 +this.removeZero(sStartArr[2]) 
      // this.planFlyDuration = '4.12min'
      if(this.planFlyDuration != undefined){
         // 获取预计时间的数字
        let planNumber = this.planFlyDuration.toString().split("m")[0] 
        // 转换成整数秒
        let planNumbM = parseInt(planNumber*60)
        // 回巢时间（单位秒）
        let allPlanSecond = sStartSecond + planNumbM
        // 回巢时间（单位：年月日时分秒）
        this.flyDuration = this.parseTime((new Date()),'{y}-{m}-{d}') + ' ' + this.formatSeconds(allPlanSecond)

        // 返航时间
        let hmsSecond = allPlanSecond -(2*60)
        this.landTime = this.parseTime((new Date()),'{y}-{m}-{d}') + ' ' + this.formatSeconds(hmsSecond)
      }
     // 2021-07-18新增---end   planFlyDuration

    
      if(this.endDate != '' || this.endDate != null){
        if(this.landTime != '' || this.landTime != null){
          // let timeObj = {
          //   starTime:this.startTime,
          //   flyDuration:this.endDate,
          //   landTime:this.landTime
          // }
          // this.$router.push({
          //   path: "/flying",
          //   query: { planId: this.flyPlan.id, timeObj:timeObj, weather:this.weather.text },
          // });
          this.$router.push({
            path: "/flying",
            query: { planId: this.flyPlan.id, starTime:this.startTime, landTime:this.landTime, flyDuration:this.flyDuration },
          });
        }
      }
      
      this.dialogShow = false
    },
    // 测试页面跳转
    // TODO delete
    ces(){
      // 点击立即起飞  获取下达任务-日期
      let execteTime = this.parseTime((new Date()),'{y}-{m}-{d}') + ' ' + this.parseTime(this.currentDate,'{h}:{i}:{s}')
      // 下达任务时间 execteTime
      this.$store.commit(EXE.SET_EXECUTE, execteTime)

      // this.$router.push({ name: 'flying' });
      this.startTime = this.parseTime((new Date()),'{y}-{m}-{d} {h}:{i}:{s}')

      

      if(this.endDate != '' || this.endDate != null){
        if(this.landTime != '' || this.landTime != null){
          // let timeObj = {
          //   starTime:this.startTime,
          //   flyDuration:this.endDate, 
          //   landTime:this.landTime
          // }
          // let timeObj = {
          //   starTime:"2021-05-16 08:55:25",
          //   flyDuration:"2021-05-16 08:56:25", 
          //   landTime:"2021-05-16 08:57:25"
          // }
          // this.$http.jsonp("https://api.douban.com//v2/movie/top250")
          //   .then(function (reponse) {
          // })
          // res.writeHead(200,{'content-Type':'text/plain',"Access-Control-Allow-Origin":"*"});
          // this.$router.push({ name: 'flying',  params: { planId: this.flyPlan.id, starTime:this.startTime, flyDuration:this.endDate, landTime:this.landTime } });
         

          this.$router.push({
            path: "/flying",
            query: { planId: this.flyPlan.id, starTime:this.startTime, landTime:this.landTime, flyDuration:this.endDate },
          });
        }
       
      }

    }

  },

}
</script>


<style>
.overview-map {
  margin: 0;
  height: 996px;
}
.overview-map .el-card__body {
  height: 100%;
  /* height: calc(100vh + 290px); */
}
.overview-map .map__el {
  height: 100%;
}


.suspend-page{
  width:1920px;
  background: url('assets/images/s-bg.png')no-repeat center center;
  background-size: cover;
  position: relative;
  /* overflow: hidden; */
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
.weather-icon-txt{
   font-size:14px;
  color:#fff;
}
/* content */
.suspend-body{
  position: relative;
  /* margin-top:86px; */
  padding-top:86px;
  display:flex;
  z-index:4;
  height: calc(100vh - 86px);
  overflow-y: auto;
}
/* 样式 */
.suspend-body::-webkit-scrollbar {width: 12px;}
.suspend-body::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(246,246,246,0.3);border-radius: 10px;}
.suspend-body::-webkit-scrollbar-thumb {border-radius: 10px;background: rgba(0,0,0,0.1);-webkit-box-shadow: inset 0 0 6px rgba(246,246,246,0.5);}
.suspend-body::-webkit-scrollbar-thumb:window-inactive {    background: rgba(160,160,160,0.4);}


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
  height:270px;
  margin-bottom: 10px;
  overflow: hidden;

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
.task-table .el-table .cell{
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

/* 样式 */
.task-table .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {width: 12px;}
.task-table .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(246,246,246,0.3);border-radius: 10px;}
.task-table .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {border-radius: 10px;background: rgba(0,0,0,0.1);-webkit-box-shadow: inset 0 0 6px rgba(246,246,246,0.5);}
.task-table .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb:window-inactive {    background: rgba(160,160,160,0.4);}



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
  height:1016px;
  margin-left: 20px;
  background: url('assets/images/s-r-bg.png')no-repeat center top;
  background-size:100% 100%;
}
.suspend-right-con{
  position: relative;
  padding:10px;
  /* height:calc(100% - 20px) */
  /* height:1016px; */
}
.suspend-map{
  width:100%;
  height:100%;
}
.suspend-bottom{
  position: absolute;
  left:0;
  bottom:4px;
  margin: 0 18px 10px;
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
  /* overflow: hidden; */
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
#map .sd-card__head{
  display:none;
}

.dialog-black{
  width:100vw;
  height:100vh;
  position:fixed;
  left: 0;
  top:0;
  z-index: 8;
  background-color: rgba(0,0,0,0.8);
}
.dialog-main{
  width:1200px;
  height: 500px;
  background:url('assets/images/dialog-bg.png')no-repeat center top;
  background-size:100%;
  position:fixed;
  left: 50%;
  top:50%;
  margin-top:-260px;
  margin-left:-600px;
  z-index: 10;
  text-align: center;
}
.dialog-fly-name{
  font-size:24px;
  font-weight: bold;
  color:#B5E4FF;
  margin: 70px 0 0;
  text-shadow: 0 0 14px #4AD4FF;
}
.dialog-fly-drone-pic{
  width:222px;
  height: 160px;
}
.dialog-load{
  text-align: center;
  margin-top:10px;
  font-size:16px;
  color:#fff;
  line-height: 24px;
}
.dialog-fly-txt{
  margin:0;
  font-size:16px;
  color:#fff;
  line-height: 24px;
}
.dialog-fly-txt2{
  margin-top:12px;
}
.dialog-fly-span{
  margin:0 15px;
}
.dialog-fly-span i{
  opacity: 0.6;
  font-style: normal;
}
.dialog-fly-span em{
  font-style: normal;
  color:#b5e4fe;
}

.dialog-fly-span em.success{
  color:#67c23a;
}
.dialog-fly-span em.warning{
  color:#e6a23c;
}
.dialog-fly-span em.danger{
  color:#f56c6c;
}
.dialog-fly-btns{
  margin-top: 20px;
  width:100%;
  text-align: center;
}
.dialog-fly-btn{
  display: inline-block;
  margin:0px 20px;
  text-align: center;
  line-height:33px;
  font-size: 14px;
}
.dialog-fly-cancel{
  cursor: pointer;
  width:101px;
  height:33px;
  background:url('assets/images/btn-1.png')no-repeat center center;
  background-size: cover;
  color:#fff;
  text-shadow: 0 0 14px #c1323e;
}
.dialog-fly-sure{
  cursor: pointer;
  width:101px;
  height:33px;
  background:url('assets/images/btn.png')no-repeat center center;
  background-size: cover;
  color:#fff;
  text-shadow: 0 0 14px #4AD4FF;
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
