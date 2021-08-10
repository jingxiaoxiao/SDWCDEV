<template>
  <div v-show="imgShow" class="loading_box">
    <!-- 下一张 -->
    <template v-if="lastShow">
      <div class="next-pic-btn opt"></div>
    </template>
     <template v-else>
      <div class="next-pic-btn"  @click="nextPic()"></div>
    </template>
    
    <!-- 上一张 -->
    <template v-if="fistShow">
      <div class="pre-pic-btn opt"></div>
    </template>
     <template v-else>
      <div class="pre-pic-btn"  @click="prePic()"></div>
    </template>

    <div class="loading_mask" ></div>
    <div class="loading_toast" @click="onImgMiss">
      <img :src="currentPic" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'sd-pic-show',
  props: {
    imgShow: {
      type: Boolean,
      default: false
    },
    imgUrl: {
      type: String,
      default: function() {
        return '';
      }
    },
    curInd:{
      type: Number,
      default: function() {
        return 0;
      }
    },
    list:{
     type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      show: false,
      picUrl: '',
      // 当前图片链接
      currentPic:'',
      // 最后一张
      lastShow:false,
      // 第一张
      fistShow:false
    };
  },
  created() {
    
    console.log('有值吗', this.list);
    
    if (this.imgShow) {
      this.show = this.imgShow
    }
    if (this.imgUrl) {
      this.picUrl = this.imgUrl
      this.currentPic = this.imgUrl
    }
    if (this.curInd) {
      console.log('序号', this.curInd);
      this.currentIndex = this.curInd
    }
  },
  watch: {
    imgShow(val) {
      this.show = val
      this.lastShow=false
      this.fistShow=false
    },
    imgUrl(val) {
      this.picUrl = val
      this.currentPic = val
    },
    curInd(val){
      this.currentIndex = val
    }
    },
    methods: {
      onImgMiss(){
        this.$emit('closeimg')
      },
      nextPic(){
        this.currentIndex = this.currentIndex + 1
        if(this.currentIndex<this.list.length){
          this.currentPic = this.list[this.currentIndex].imgUrl
        }else{
          console.log('下一个没有了');
          this.lastShow=true
          this.fistShow=false
          this.$message({
            message: '已经是最后一张',
            type: 'warning'
          });
        }
        
      },
      prePic(){
        console.log("上一个");
        this.currentIndex = this.currentIndex - 1
        if(this.currentIndex>=0){
          this.currentPic = this.list[this.currentIndex].imgUrl
         
        }else{
          console.log('上一个没有了');
          this.lastShow=false
          this.fistShow=true
          this.$message({
            message: '已经是第一张',
            type: 'warning'
          });
        }
        
      }
    }
}
</script>

<style>
.loading_box .loading_mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 13;
}
.loading_box .loading_toast {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translateX(-50%) translateY(-50%);
  /* // border-radius: 5px; */
  /* // background: rgba(0, 0, 0, 0.8); */
  text-align: center;
  padding: 25px 0;
  box-sizing: border-box;
  /* // font-size: 18px; */
  z-index: 5001;
}
.loading_box .loading_toast img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.next-pic-btn{
  cursor: pointer;
  width:48px;
  height:128px;
  position: fixed;
  right: 30px;
  top:50%;
  margin-top:-64px;
  z-index: 9999;
   background:url('assets/images/swiper_button-rgt.png')no-repeat center center;
  background-size: cover;
}
.pre-pic-btn{
  cursor: pointer;
  width:48px;
  height:128px;
  position: fixed;
  left: 30px;
  top:50%;
  margin-top:-64px;
  z-index: 9999;
   background:url('assets/images/swiper_button-lft.png')no-repeat center center;
  background-size: cover;
}
.opt{
  cursor:default;
  opacity: 0.4;

}

</style>
