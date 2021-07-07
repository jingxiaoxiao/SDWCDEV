<template>
  <div class="only-wrap">
    <!-- <h1 style="color:#fff">抽出控制</h1> -->
    <!-- on-screen control container, also host click events -->
    <!-- 云台原有 隐藏 -->
    <div class="monitor-drone-control" :class="wrapperClass">
      <!-- double-click target point -->
      <transition name="el-fade-in">
        <div
          class="monitor-drone-control__target"
          :style="`left:${target.left}px;top:${target.top}px`"
        ></div>
      </transition>
      <div
        v-if="point.params && point.params.control && point.params.control.gimbal"
        class="monitor-drone-control--horizontal"
      >
        <!-- pitch angle right x轴-->
        <el-slider
          v-model="gimbal.yaw"
          :min="point.params.control.gimbal.yaw[0]"
          :max="point.params.control.gimbal.yaw[1]"
          @change="handleGimbalCtl({ yaw: $event })"
          style="width:180px"
        />
        <!-- button 'center' 重置 -->
        <el-tooltip class="monitor-drone-control__restore" placement="top">
          <span slot="content" v-t="'monitor.gimbal.reset'"></span>
          <el-button circle size="mini" icon="el-icon-refresh" @click="handleGimbalRestore"></el-button>
        </el-tooltip>
      </div>
      <div
        v-if="point.params && point.params.control && point.params.control.gimbal"
        class="monitor-drone-control--vertical"
      >
        <!-- pitch angle left y轴 -->
        <el-slider
          vertical
          v-model="gimbal.pitch"
          :min="point.params.control.gimbal.pitch[0]"
          :max="point.params.control.gimbal.pitch[1]"
          @change="handleGimbalCtl({ pitch: $event })"
          height="135px"
        />
      </div>
      <div v-if="point.params && point.params.control && point.params.control.zoom" class="monitor-drone-control--bottom">
      
        <!-- zoom slider bottom -->
        <!-- <el-slider
          vertical
          v-model="gimbal.zoom"
          :min="point.params.control.zoom.zoom[0]"
          :max="point.params.control.zoom.zoom[1]"
          :step="0.1"
          @change="handleGimbalZoom"
          height="100px"
        /> -->
        <!-- zoom reset -->
        <!-- <el-tooltip class="monitor-drone-control__restore" placement="bottom">
          <span slot="content" v-t="'monitor.zoom.reset'"></span>
          <el-button circle size="mini" icon="el-icon-refresh" @click="handleZoomRestore"> ddd</el-button>
        </el-tooltip> -->
      </div>
    </div>

    <!-- 拍照 -->
    <div class="btm-btn">
      <div class="btm-btn-item btm-btn-over"  v-if="availableActions.length==0">无视频</div>
      <div class="btm-btn-item"  v-for="a of availableActions" :key="a.method" @click="handleAction(a.method)">{{a.label || a.method}}</div>    
    </div>

    <!-- -->
    <template  v-if="streamAvailable">
      <!-- 云台自己 -->
      <div class="center-control">
        <img class="control-poit control-top"  @click="handleGimUp(2)" src="/assets/images/Polygon1.png" alt="">
        <img class="control-poit control-bottom" @click="handleGimDown(1)" src="/assets/images/Polygon2.png" alt="">
        <img class="control-poit control-left" @click="handleGimLft(3)" src="/assets/images/Polygon3.png" alt="">
        <img class="control-poit control-right" @click="handleGimRig(4)" src="/assets/images/Polygon4.png" alt="">
        <img class="control-ok"  @click="handleGimbalRestore" src="/assets/images/Polygon-ok.png" alt="">
      </div>
      <!-- 虚拟摇杆 -->
      <!-- <div class="center-control">
        <div class="monitor-drone-joystick" ref="joysticks" v-show="remoteShow" >
          <div class="monitor-drone-joystick__zone"></div>
          <div class="monitor-drone-joystick__zone"></div>
        </div>
      </div> -->
     
    </template>
  
    

 </div>
</template>

<script>
import throttle from 'lodash/throttle';
import nipplejs from 'nipplejs';

import { h } from '@/util/create-element';
import { waitSelector } from '@/util/wait-selector';

import Monitor from '@/components/monitor/video.vue';

// 
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'sd-drone-operate',
  inheritAttrs: false,
  props: {
    videoBigShow:{
      type: Boolean,
      required: false
    },
    point: {
      type: Object,
      required: true
    },
    status: {
      type: Object,
      required: true
    },
    msg: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      source: {
        pending: false
      },
      control: {
        enabled: ''
      },
      gimbal: {
        yaw: 0,
        pitch: 0,
        zoom: 1,
        source: ''
      },
      gesture: {
        valid: false,
        lastTime: -1,
        lastPos: {
          x: 0,
          y: 0
        }
      },
      target: {
        show: false,
        left: 0,
        top: 0
      },
      joystick: {
        show: false,
        pending: false,
        created: false,
        moving: [false, false],
        data: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
        interval: -1
      },
      // 
      remoteShow:true,
      streamAvailable: true,
      // 当前点击的按钮
      currentBtn:0
     
    };
  },
  computed: {
    allDisabled() {
      return this.status.code !== 0;
    },
    videoSources() {
      const params = this.point.params || { source: [] };
      return params.source;
    },
    availableControls() {
      const params = this.point.params || { control: {} };
      const controls = [];
      for (const [k, v] of Object.entries(params.control)) {
        if (k === 'stick') continue;
        controls.push(Object.assign({ type: k }, v));
      }
      return controls;
    },
    hasStickControl() {
      const params = this.point.params || { control: {} };
      return Object.prototype.hasOwnProperty.call(params.control, 'stick');
    },
    availableActions() {
      const params = this.point.params || { action: [] };
      const enabled = this.msg.action_enabled;
      return params.action.filter(a => enabled.includes(a.method));
    },
    overlaySVG() {
      const { width, height, shapes } = this.msg.overlay_screen;
      const elements = [];
      for (const s of shapes) {
        elements.push(s);
        if (s.label) {
          const offset = s['stroke-width'] || 1;
          elements.push({
            type: 'text',
            text: s.label,
            x: s.x + offset,
            y: s.y + offset,
            'alignment-baseline': 'hanging',
            fill: s.stroke || s.fill
          });
        }
      }
      return { viewBox: `0 0 ${width} ${height}`, elements };
    },
    gimbalDisabled() {
      return this.allDisabled || this.control.enabled !== 'gimbal';
    },
    wrapperClass() {
      return {
        'monitor-drone-control--moving': this.gesture.valid
      };
    },
    ...mapState([
      'execute'
    ]),
    
  },
  methods: {
    /**
     * @param {'visual' | 'thermal' | 'msx'} source
     * @param {MouseEvent} event
     */
    async handleVideoSource(source, event) {
      /**
       * in dom like `<label><input type="radio"><span>text<span></label>`,
       * click on span causes label's click event triggers twice.
       * 1st's target is span, 2nd's target is input.
       */
      if (event.target.tagName === 'INPUT') return;
      this.source.pending = true;
      try {
        await this.$mqtt(this.point.node_id, {
          mission: 'camera',
          arg: { action: 'source', value: source }
        });
      } catch (e) { /* noop */ }
      this.source.pending = false;
    },
    async handleRestratStream() {
      this.source.pending = true;
      try {
        await this.$mqtt(this.point.node_id, {
          mission: 'restart_stream'
        });
      } catch (e) { /* noop */ }
      this.source.pending = false;
    },
    handleReconnect() {
      this.$refs.monitor.$refs.content.handleRetry();
    },
    /**
     * @param {'gimbal' | 'zoom' | 'stick'} type
     * @param {MouseEvent} event
     */
    handleControlType(type) {
     alert(type) 
     //  alert(event)
      if (event.target.tagName === 'INPUT') return;
      // this.toggleJoystick();
      this.control.enabled = 'stick';



      // if (type === 'stick') {
      //   this.toggleJoystick();
      // } else if (this.control.enabled === type) {
      //   this.control.enabled = '';
      // } else {
      //   this.control.enabled = type;
      // }
    },
    /**
     * @param {string} method
     */
    handleAction(method) {
      alert(method)
      this.$mqtt(this.point.node_id, {
        mission: method
      });
    },
    /**
     * @param {{ yaw?: number; pitch?: number }} param
     */
    handleGimbalCtl(param) {
      // alert("摄像头"+param)
      console.log('摄像头', param)
      this.$mqtt(this.point.node_id, {
        mission: 'gimbal',
        arg: param
      }, {
        notification: true
      });
    },
    /**
     * @param {number} zoom
     */
    handleGimbalZoom(zoom) {
      alert('重置2')
      this.$mqtt(this.point.node_id, {
        mission: 'camera',
        arg: { action: 'zoom', zoom }
      }, {
        notification: true
      });
    },
    handleGimbalTarget(x, y) {
      const t = x => Math.trunc(x * 1000) / 1000;
      this.$mqtt(this.point.node_id, {
        mission: 'gimbal_target',
        arg: { x: t(x), y: t(y) }
      }, {
        notification: true
      });
    },
    handleGimbalRestore() {
      alert('重置-真正')
      this.handleGimbalCtl({ yaw: 0, pitch: 0 });
      this.gimbal.yaw = 0;
      this.gimbal.pitch = 0;
    },
    // 自定义云台-右
    handleGimRig() {
      let gimbalMax = this.point.params.control.gimbal.yaw[1]
      if(gimbalMax > this.gimbal.yaw){
        this.gimbal.yaw += 10
        this.rigBan = false
      } else{
        this.gimbal.yaw = gimbalMax
        this.rigBan = true
      }
      this.handleGimbalCtl({ yaw: this.gimbal.yaw })
    },
    // 自定义云台-左
    handleGimLft() {
      let gimbalMin = this.point.params.control.gimbal.yaw[0]
      if(gimbalMin < this.gimbal.yaw){
        this.gimbal.yaw -= 10
        this.lftBan = false
      } else{
        this.gimbal.yaw = gimbalMin
        this.lftBan = true
      }
      
      // this.gimbal.yaw, this.gimbal.pitch
      this.handleGimbalCtl({ yaw: this.gimbal.yaw })
    },
    // 自定义云台-上
    handleGimUp() {
      let gimbalMax = this.point.params.control.gimbal.pitch[1]
      if(gimbalMax > this.gimbal.pitch){
        this.gimbal.pitch += 10
        this.upBan = false
      } else{
        this.gimbal.pitch = gimbalMax
        this.upBan = true
      }
      // this.gimbal.yaw, this.gimbal.pitch
      this.handleGimbalCtl({ pitch: this.gimbal.pitch })
      // alert('上控制:'+this.gimbal)
    },
    // 自定义云台-下
    handleGimDown() {
      let gimbalMin = this.point.params.control.gimbal.pitch[0]
      if(gimbalMin < this.gimbal.pitch){
        this.gimbal.pitch -= 10
        this.downBan = false
      } else{
        this.gimbal.pitch = gimbalMin
        this.downBan = true
      }
      this.handleGimbalCtl({ pitch: this.gimbal.pitch })
    },
    // 
    handleZoomRestore() {
      alert('重置1')
      this.handleGimbalZoom(1);
      this.gimbal.zoom = 0;
    },
    handleGestureStart(x, y) {
      console.log('按下鼠标左键')
      if (this.gimbalDisabled) return;
      this.gesture.valid = true;
      this.gesture.lastPos = { x, y };
      this.gesture.lastTime = Date.now();
    },
    handleGestureMove(x, y) {
      // console.log('手势移动')
      if (this.gimbalDisabled) return;
      if (!this.gesture.valid) return;
      this.sendGestureCtl(x, y);
      this.gesture.lastPos = { x, y };
    },
    handleGestureEnd(x, y) {
      console.log('释放鼠标左键')
      if (this.gimbalDisabled) return;
      if (!this.gesture.valid) return;
      if (this.gesture.lastPos.x !== x || this.gesture.lastPos.y !== y) {
        this.sendGestureCtl(x, y);
      }
      this.gesture.valid = false;
    },
    sendGestureCtl(x, y) {
      console.log('这是什么444')
      const now = Date.now();
      const factor = (now - this.gesture.lastTime) / 8;
      let { yaw, pitch } = this.gimbal;
      const dx = Math.trunc((this.gesture.lastPos.x - x) / factor);
      const dy = Math.trunc((y - this.gesture.lastPos.y) / factor);
      if (yaw + dx > 90) {
        yaw = 90;
      } else if (yaw + dx < -90) {
        yaw = -90;
      } else {
        yaw += dx;
      }
      if (pitch + dy > 45) {
        pitch = 45;
      } else if (pitch + dy < -90) {
        pitch = -90;
      } else {
        pitch += dy;
      }
      this.gimbal.yaw = yaw;
      this.gimbal.pitch = pitch;
      this.handleGimbalCtl({ yaw, pitch });
      this.gesture.lastTime = now;
    },
    /**
     * @param {DOMRect} rect
     * @param {MouseEvent} ev
     */
    handleDblClick(rect, ev) {
      const left = ev.clientX - rect.left;
      const top = ev.clientY - rect.top;
      const x = left / rect.width;
      const y = top / rect.height;
      this.handleGimbalTarget(x, y);
      this.target = { left, top, show: true };
      setTimeout(() => {
        if (top === this.target.top && left === this.target.left) {
          this.target.show = false;
        }
      }, 500);
    },
    bindGestures() {
      /** @type {HTMLDivElement} */
      // monitor-drone-control
      // center-control
      const el = this.$el.getElementsByClassName('center-control')[0];
      if (!el) {
        setTimeout(() => this.bindGestures(), 150);
        return;
      }
      // Gesture Start
      el.addEventListener('mousedown', ev => {
        if (ev.target !== el && event.target.parentElement !== el) return;
        this.handleGestureStart(ev.x, ev.y);
        console.log('监听事件-mousedown-x',ev.x)
        console.log('监听事件-mousedown-y',ev.y)
        if(ev.target.className.indexOf("control-bottom") != -1){
          this.currentBtn = 1 // y减10
        }else if(ev.target.className.indexOf("control-top") != -1){
          this.currentBtn = 2 // y加10
        }else if(ev.target.className.indexOf("control-left") != -1){
          this.currentBtn = 3 // x减10
        }else if(ev.target.className.indexOf("control-right") != -1){
          this.currentBtn = 4 // x加10
        }else if(ev.target.className.indexOf("control-ok") != -1){
          this.currentBtn = 5
        }
        this.handleGestureStart(this.gimbal.yaw, this.gimbal.pitch);
      });
      // el.addEventListener('touchstart', ev => {
      //   if (ev.target !== el && event.target.parentElement !== el) return;
      //   // do not prevent scroll when control disabled
      //   if (this.gimbalDisabled) return;
      //   ev.preventDefault();
      //   const t = ev.touches[0] || ev.targetTouches[0] || ev.changedTouches[0];
      //   if (!t) return;
      //   this.handleGestureStart(t.pageX, t.pageY);
      // });
      // Gesture Move
      el.addEventListener('mousemove', ev => {
        // console.log('监听事件-mousemove-x',ev.x)
        // console.log('监听事件-mousemove-y',ev.y)
        // this.handleGestureMoveThrottled(ev.x, ev.y);
        // this.gimbal.yaw, this.gimbal.pitch
        switch ( this.currentBtn )
        {
          case '1':
            this.gimbal.pitch -= 10;
            break;
          case '2':
            this.gimbal.pitch += 10;
            break;
          case '3':
            this.gimbal.yaw -= 10;
            break;
          case '4':
            this.gimbal.yaw += 10;
            break;
          default:
            break;
        }
        this.handleGestureMoveThrottled(this.gimbal.yaw, this.gimbal.pitch);
      });
      // el.addEventListener('touchmove', ev => {
      //   if (ev.target !== el && event.target.parentElement !== el) return;
      //   const t = ev.touches[0] || ev.targetTouches[0] || ev.changedTouches[0];
      //   if (!t) return;
      //   this.handleGestureMoveThrottled(t.pageX, t.pageY);
      // });
      // Gesture End
      el.addEventListener('mouseup', ev => {
        console.log('监听事件-mouseup-x',ev.x)
        console.log('监听事件-mouseup-y',ev.y)
        // this.handleGestureEnd(ev.x, ev.y);
        // this.gimbal.yaw, this.gimbal.pitch
        switch ( this.currentBtn )
        {
          case '1':
            this.gimbal.pitch -= 10;
            break;
          case '2':
            this.gimbal.pitch += 10;
            break;
          case '3':
            this.gimbal.yaw -= 10;
            break;
          case '4':
            this.gimbal.yaw += 10;
            break;
          case '5':
            // this.gimbal.yaw = this.gimbal.yaw
            // this.gimbal.pitch = this.gimbal.pitch
            break;
          default:
            break;
        }
        this.handleGestureEnd(this.gimbal.yaw, this.gimbal.pitch);
      });
      // el.addEventListener('touchend', ev => {
      //   if (ev.target !== el && event.target.parentElement !== el) return;
      //   const t = ev.touches[0] || ev.targetTouches[0] || ev.changedTouches[0];
      //   if (!t) return;
      //   this.handleGestureEnd(t.pageX, t.pageY);
      // });
      // Gesture Cancel
      // el.addEventListener('mouseleave', ev => {
      //   this.handleGestureEnd(ev.x, ev.y);
      // });
      // Double Click
      el.addEventListener('dblclick', ev => {
        const rect = el.getBoundingClientRect();
        this.handleDblClick(rect, ev);
      });
    },
    /**
     * @param {number} index
     */
    createSingleJoystick(index) {
      const instance = nipplejs.create({
        zone: this.$refs.joysticks.children[index],
        mode: 'static',
        position: { top: '50%', left: '50%' },
        dynamicPage: true,
        restOpacity: 0.6,
        fadeTime: 200
      });
      instance.on('start', () => this.$set(this.joystick.moving, index, true));
      instance.on('end', () => {
        this.$set(this.joystick.moving, index, false);
        this.$set(this.joystick.data, index, { x: 0, y: 0 });
      });
      instance.on('move', (e, data) => this.$set(this.joystick.data, index, data.vector));
      return instance;
    },
    createJoystick() {
      const joysticks = [];
      for (let i = 0; i < 2; i++) {
        joysticks.push(this.createSingleJoystick(i));
      }
      waitSelector(this.$refs.joysticks.children[0], '.back').then(el => {
        el.append(
          h('i', { class: 'el-icon-top', style: 'top:0;left:42px' }),
          h('i', { class: 'el-icon-refresh-right', style: 'top:42px;right:0' }),
          h('i', { class: 'el-icon-bottom', style: 'bottom:0;left:42px' }),
          h('i', { class: 'el-icon-refresh-left', style: 'top:42px;left:0' })
        );
      });
      waitSelector(this.$refs.joysticks.children[1], '.back').then(el => {
        el.append(
          h('i', { class: 'el-icon-arrow-up', style: 'top:0;left:42px' }),
          h('i', { class: 'el-icon-arrow-right', style: 'top:42px;right:0' }),
          h('i', { class: 'el-icon-arrow-down', style: 'bottom:0;left:42px' }),
          h('i', { class: 'el-icon-arrow-left', style: 'top:42px;left:0' })
        );
      });
      this._joysticks = joysticks;
      this.joystick.created = true;
    },
    async toggleJoystick() {
      const initialShow = this.joystick.show;
      try {
        this.joystick.pending = true;
        await this.$mqtt(this.point.node_id, {
          mission: 'stick_mode',
          arg: [initialShow ? 'rc' : 'virtual']
        });
        this.joystick.show = !initialShow;
        if (this.joystick.show && !this.joystick.created) {
          this.createJoystick();
        }
        this.$refs.joysticks.style.display = this.joystick.show ? '' : 'none';
      } catch (e) { /* noop */ }
      this.joystick.pending = false;
    },
    destroyJoystick() {
      if (Array.isArray(this._joysticks)) {
        for (const instance of this._joysticks) {
          instance.destroy();
        }
        delete this._joysticks;
      }
      this.joystick.created = false;
    },
    sendStickCtl() {
      const [m0, m1] = this.joystick.data;
      const r = num => Math.round(num * 100);
      this.$mqtt(this.point.node_id, {
        mission: 'stick_ctl',
        arg: {
          x: r(m1.x),
          y: r(m1.y),
          z: r(m0.y),
          r: r(m0.x)
        }
      }, { notification: true });
    },
    // 
    
    
  },
  watch: {
    ['status.code'](val) {
      if (val !== 0) {
        if (this.joystick.created) {
          this.destroyJoystick();
        }
      } else {
        if (this.joystick.show) {
          this.$nextTick(() => this.createJoystick());
        }
      }
    },
    ['joystick.moving'](val) {
      if (val.every(v => v === false)) {
        if (this.joystick.interval >= 0) {
          clearInterval(this.joystick.interval);
          this.joystick.interval = -1;
        }
      } else {
        if (this.joystick.interval < 0) {
          this.joystick.interval = setInterval(() => {
            this.sendStickCtl();
          }, 1000 / 25);
        }
      }
    }
  },
  created() {
    // TODO: sync values between msg.gimbal and $data.gimbal
    this.gimbal = { ...this.msg.gimbal };
    if(this.status.code !== 0){
      this.streamAvailable = false
    }
    // 
    
  },
  mounted() {
    
    this.handleGestureMoveThrottled = throttle(this.handleGestureMove, 55);
    this.$nextTick(() => this.bindGestures());
    // 
    this.toggleJoystick();
    // 
   
    
  },
  beforeDestroy() {
    this.destroyJoystick();
  },
  components: {
    [Monitor.name]: Monitor
  }
};
</script>

<style>
.drone .sd-card__action .el-dropdown {
  margin-left: 10px;
}
.monitor-drone__switch {
  margin-left: 10px;
}
.monitor-drone-control,
.monitor__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.only-wrap .monitor-drone-control{
  display:none;
}
.monitor__svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: none;
  font-size: 24px;
}
.monitor-drone-control__target {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin: -20px 0 0 -20px;
  background-color: #409effb2;
  transition-property: opacity;
}
.monitor-drone-control--horizontal {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.monitor-drone-control--vertical {
  display: flex;
  justify-content: flex-end;
}
.monitor-drone-control--bottom {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.monitor-drone-control--moving {
  cursor: move;
}
.monitor-drone-control__restore {
  margin: 5px;
}
.monitor-drone-joystick {
  position: absolute;
  bottom: 10px;
  right: 0;
  left: 0;
  height: 120px;
  display: flex;
  justify-content: center;
}
.monitor-drone-joystick__zone {
  position: relative;
  height: 120px;
  width: 120px;
  margin: 0 10px;
}
.monitor-drone-joystick__zone i {
  position: absolute;
}
.monitor-drone-joystick__zone .front {
  width: 30px !important;
  height: 30px !important;
  margin: -15px 0 0 -15px !important;
}
.sd--safari .monitor--full .monitor-drone-control {
  top: 18px;
  right: 4px;
  overflow: hidden;
}
/* 拍照 */
.btm-btn{
  margin-top:150px;
  float: right;
  margin-right:20px;
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
/* 底部 */

/* btm-rgt */

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
  width:60px;
  height:60px;
  z-index:2;
  cursor: pointer;
}
.control-top{
  left:50%;
  top:20px;
  margin-left:-30px;
}
.control-bottom{
  left:50%;
  bottom:20px;
  margin-left:-30px;
}
.control-left{
  left:20px;
  top:50%;
  margin-top:-30px;
}
.control-right{
  right:20px;
  top:50%;
  margin-top:-30px;
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


</style>
