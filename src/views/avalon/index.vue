<template>
  <div>
    <div class="main-view">
      <img class="bg-img-paper" src="../../../static/image/UI/musicPaper.png">

      <!-- op -->
      <div v-if="step === 0" @click="nextStep(1)" class="flex-center" style="height: 100%">
        <img id="begin-logo" src="../../../static/image/UI/logo.png">
      </div>

      <!-- 遊戲設置階段 -->
      <div v-show="step === 1">
        <div class="flex-center">
          <div style="width: 40%;padding: 20px;text-align:center">
            <img style="width: 70%" src="../../../static/image/UI/logo.png">
          </div>
        </div>

        <div class="role-section">
          <div class="flex-center" style="margin-bottom: 10px;">
            <div class="btn-cursor"><img src="../../../static/image/UI/role-pic-1-1.jpg"><div class="selected-border"></div></div>
            <div class="btn-cursor"><img src="../../../static/image/UI/role-pic-1-2.jpg"><div class="selected-border"></div></div>
            <div class="btn-cursor" @click="selectRole(1, 3)"><img src="../../../static/image/UI/role-pic-1-3.jpg"><div :class="{'selected-border': gameSet.good.includes(3)}"></div></div>
            <div class="btn-cursor" @click="selectRole(1, 4)"><img src="../../../static/image/UI/role-pic-1-4.jpg"><div :class="{'selected-border': gameSet.good.includes(4)}"></div></div>
            <div class="btn-cursor" @click="selectRole(1, 5)"><img src="../../../static/image/UI/role-pic-1-5.jpg"><div :class="{'selected-border': gameSet.good.includes(5)}"></div></div>
            <div class="btn-cursor" @click="selectRole(1, 6)"><img src="../../../static/image/UI/role-pic-1-6.jpg"><div :class="{'selected-border': gameSet.good.includes(6)}"></div></div>
          </div>
          <div class="flex-center">
            <div class="btn-cursor"><img src="../../../static/image/UI/role-pic-0-1.jpg"><div class="selected-border"></div></div>
            <div class="btn-cursor"><img src="../../../static/image/UI/role-pic-0-2.jpg"><div class="selected-border"></div></div>
            <div class="btn-cursor" @click="selectRole(0, 3)"><img src="../../../static/image/UI/role-pic-0-3.jpg"><div :class="{'selected-border': gameSet.bad.includes(3)}"></div></div>
            <div class="btn-cursor" @click="selectRole(0, 4)"><img src="../../../static/image/UI/role-pic-0-4.jpg"><div :class="{'selected-border': gameSet.bad.includes(4)}"></div></div>
            <div class="btn-cursor" @click="selectRole(0, 5)"><img src="../../../static/image/UI/role-pic-0-5.jpg"><div :class="{'selected-border': gameSet.bad.includes(5)}"></div></div>
            <div class="btn-cursor" @click="selectRole(0, 6)"><img src="../../../static/image/UI/role-pic-0-6.jpg"><div :class="{'selected-border': gameSet.bad.includes(6)}"></div></div>
          </div>
        </div>

        <div class="function-section flex-center">
          <!-- 人數 -->
          <div class="flex-center width-average3">
            <span style="font-weight:bold;font-size:20px">遊玩人數：</span>
            <div class="btn-people-setting btn-cursor btn-style1" @click="peopleQuantityVisible = true">
              {{campList[gameSet.campId].quantity}}人
              <br>
              <span style="font-size:20px">({{campList[gameSet.campId].good}}好{{campList[gameSet.campId].bad}}壞)</span>
            </div>
          </div>

          <!-- 開始 -->
          <div class="flex-center width-average3">
            <div class="btn-start btn-cursor btn-style1" @click="gameStart(gameSet.campId)">開始遊戲</div>
          </div>

          <!-- 設置 -->
          <div class="flex-center width-average3">
            <div class="btn-other-setting btn-cursor btn-style1" @click="openOtherSet()">設置</div>
          </div>
        </div>
      </div>

      <!-- 人數設定框 -->
      <div v-if="peopleQuantityVisible" class="dialog" style="display: inline-block;">
        <div style="width:100%">
          <h2 style="text-align:center">請選擇遊玩人數</h2>
        </div>
        
        <div class="flex-center" style="width:100%">
          <div class="btn-cursor btn-style1 width-average6" style="margin:0 5px;" v-for="(camp, index) in campList" :key="camp.id" @click="setCamp(index)">
            {{camp.quantity}}人
            <br>
            <span style="font-size:20px">({{camp.good}}好{{camp.bad}}壞)</span>
          </div>
        </div>
      </div>

      <div class="bg-mask" v-if="peopleQuantityVisible" @click="peopleQuantityVisible = false"></div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import roleJson from '../../assets/data/role.json';
import campJson from '../../assets/data/camp.json';

Array.prototype.remove = function(val) { 
  var index = this.indexOf(val); 
  if (index > -1) { 
    this.splice(index, 1); 
  } 
}; 

export default {
  data () {
    return {
      json: {},
      campList: {},

      step: 0,

      gameSet: {
        campId: 0,
        good: [1,2],
        bad: [1,2]
      },

      peopleQuantityVisible: false,
    }
  },
  created() {
    this.json = roleJson
    this.campList = campJson
  },
  mounted () {
    $("#begin-logo").animate({opacity:'100%'}, 1000)
  },
  methods: {
    selectRole (camp, roleId) {
      if (camp === 1) {
        if (!this.gameSet.good.includes(roleId) && this.gameSet.good.length + 1 <= this.campList[this.gameSet.campId].good) {
          this.gameSet.good.push(roleId)
          this.gameSet.good = this.gameSet.good.sort()
        } else if (this.gameSet.good.includes(roleId)) {
           this.gameSet.good.remove(roleId)
        }
      } else if (camp === 0) {
        if (!this.gameSet.bad.includes(roleId) && this.gameSet.bad.length + 1 <= this.campList[this.gameSet.campId].bad) {
          this.gameSet.bad.push(roleId)
          this.gameSet.bad = this.gameSet.bad.sort()
        } else if (this.gameSet.bad.includes(roleId)) {
           this.gameSet.bad.remove(roleId)
        }
      }
    },
    setCamp (id) {
      this.gameSet.campId = id
      this.peopleQuantityVisible = false
    },
    nextStep (num) {
      this.step = num
    },
    gameStart (id) {
      if (this.gameSet.good.length === this.campList[id].good && this.gameSet.bad.length === this.campList[id].bad) {
        this.$router.push({path: '/game', query: {campId: this.gameSet.campId, good: this.gameSet.good.join(''), bad: this.gameSet.bad.join('')}})
      } else {
        alert('人數選擇有誤，請選擇' + this.campList[id].good + '好人' + this.campList[id].bad + '壞人')
      }
    }
  }
}
</script>
