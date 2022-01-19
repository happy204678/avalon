<template>
  <div>
    <div class="main-view">
      <img class="bg-img-paper" src="../../../static/image/UI/musicPaper.png">
      <!-- 身分確認階段 -->
      <div v-show="step === 2" class="role-ckeck-section">
        <div class="top">
          <p>各位玩家請選好順序號碼就坐，輪到你號碼的玩家，請移動鼠標至中間卡片確認身分，該號碼翻過卡片後將會提示<b>(已確認)</b>字樣。</p>
          <p>確認完身分後請點擊右下角案按鈕，換下一號玩家。</p>
        </div>

        <h3>{{cardCheckIndex + 1}}號玩家身分確認<b v-show="cardChecked">(已確認)</b></h3>
        <h4 v-if="gameSet.order.length > 0" :class="{'show-visibility':cardHovering}">{{json[gameSet.order[cardCheckIndex]].name}}</h4>
        <div v-if="gameSet.order.length > 0" class="container">
          <div class="front"></div>
          <div class="back"><img :src="'../../../static/image/roles/' + gameSet.order[cardCheckIndex] + '.png'" /></div>
          <div class="right" :class="{'show-visibility':cardHovering}">{{json[gameSet.order[cardCheckIndex]].description}}</div>
        </div>
        <div class="bottom" @click="nextPlayer()">
          <span>下一位</span>
          <img src="../../../static/image/UI/1-play.png" style="width:20px">
        </div>
      </div>

      <div v-show="step === 3" class="id-check-section">
        <h3>請所有玩家依序就坐，閉上眼睛，將雙手握拳放在自己面前，並按照音檔提示的進行動作。</h3>
        <audio id="idcheck" controls src="../../assets/audio/idcheck.mp3"></audio>
        <div v-show="audioPlayStatus" @click="step++">
          <span>開始派遣</span>
          <img src="../../../static/image/UI/1-play.png" style="width:20px">
        </div>
      </div>

      <div v-show="step === 4" class="game-section">
        <div style="width: 40%;padding: 20px;position: absolute;">
          <img style="width: 70%" src="../../../static/image/UI/logo.png">
        </div>
        <!-- 背景、任務狀態、投票次數記錄 -->
        <div class="hall">
          <h2>{{orderIndex + 1}}號玩家隊長請派遣出征隊員...</h2>
          <div class="btn" @click="dispatchVisible = true">派遣</div>

          <div class="task-ul">
            <div class="task-li" v-for="(item, index) in campList[gameSet.campId].task" :key="index" :class="{'task-success': taskResult[index] === true, 'task-fail': taskResult[index] === false}">
              <span class="task">任務{{index + 1}}</span>
              <span class="num">{{item.num}}</span>
              <span v-if="item.failCondition > 1" class="desc">需要{{item.failCondition}}張以上失敗</span>
              <div class="status" v-show="taskIndex === index"></div>
            </div>
          </div>
          
        </div>
        <div class="vote-record">
          投票次數紀錄: <b style="font-size:20px" :class="{'red': voteTimes === 4}">{{voteTimes}}</b> 次(第5次投票不管投票結果必出征)
        </div>

        <!-- 選擇出征人員 -->
        <div v-if="dispatchVisible" class="dialog">
          <div>
            <h2 style="text-align:center">請選擇 {{campList[gameSet.campId].task[taskIndex].num}}位 出征人數</h2>
          </div>
          
          <div class="flex-center">
            <div class="btn-cursor btn-style1" style="margin:0 5px;justify-content: space-evenly;padding:0 10px;text-align: center;" :class="{'selected': nowSelected.indexOf(index) !== -1}" v-for="(item, index) in gameSet.order" :key="index" @click="setOffSelect(index)" v-show="index !== orderIndex">
              {{index + 1}}號
            </div>
          </div>
          <div @click="setOffSet()" class="btn-cursor btn-style1" style="width:fit-content;padding:0 10px;background: antiquewhite;">確定</div>
        </div>

        <!-- 同意/不同意 -->
        <div v-if="agreeVisible" class="dialog">
          <div>
            <h2 style="text-align:center">請選擇 同意/不同意 出征人員陣容</h2>
            <p style="text-align:center">請利用 手心/手背 代表 同意/不同意，多數決確定出征結果。</p>
          </div>
          
          <div class="flex-center">
            <div class="btn-cursor btn-style1" style="width:fit-content;padding:0 10px;background: antiquewhite;" @click="agree(true)">同意</div>
            <div class="btn-cursor btn-style1" style="width:fit-content;padding:0 10px;background: antiquewhite;" @click="agree(false)">不同意</div>
          </div>
        </div>

        <!-- 出征任務結果選擇 -->
        <div v-if="setOffVisible" class="dialog">
          <div>
            <h2 style="text-align:center">{{nowSelected[successIndex] + 1}}號玩家請選擇想要的任務的結果</h2>
            <p style="text-align:center">所有人請轉過身</p>
          </div>
          
          <div class="flex-center">
            <div class="btn-cursor btn-style1" style="width:fit-content;padding:0 10px;background: antiquewhite;" @click="success(true)">成功</div>
            <div class="btn-cursor btn-style1" style="width:fit-content;padding:0 10px;background: antiquewhite;" @click="success(false)">失敗</div>
          </div>
        </div>

        <!-- 出征結果 -->
        <div v-if="setOffResultVisible" class="dialog">
          <div>
            <h2 style="text-align:center" v-if="taskResult[taskResult.length - 1]">任務成功</h2>
            <h2 style="text-align:center" v-else>任務失敗</h2>
          </div>
          <div class="flex-center average-ul">
            <div v-for="(item, index) in successList" :key="index">
              <img :src="'../../../static/image/UI/misson-result' + (item ? 1 : 0) + '.png'" :class="{'an-taskfail': !item, 'an-tasksuc': item}"/>
            </div>
          </div>
        </div>

        <!-- 刺殺 -->
        <div v-if="killVisible" class="dialog">
          <div>
            <h2 style="text-align:center">壞人現身，請選擇要刺殺的號碼...</h2>
          </div>
          
          <div class="flex-center">
            <div class="btn-cursor btn-style1" style="margin:0 5px;justify-content: space-evenly;padding:0 10px" v-for="(item, index) in gameSet.order" :key="index" @click="kill(item)" v-show="item.split('')[0] === '1'">
              {{index + 1}}號
            </div>
          </div>
        </div>

        <!-- 結束 -->
        <div v-if="resultVisible" class="dialog" :class="{'top-reset': gameSet.order.length > 6}">
          <div>
            <h2 style="text-align:center" v-if="win === 1">好人獲勝</h2>
            <h2 style="text-align:center" v-else>壞人獲勝</h2>
          </div>

          <div class="flex-center average-ul">
            <div v-for="(item, index) in gameSet.order" :key="index">
              <div class="ab-top-mid">{{index + 1}} 號</div>
              <img :src="'../../../static/image/roles/' + item + '.png'"/>
            </div>
          </div>

          <div class="flex-center">
            <div class="btn-cursor btn-style1" style="width:fit-content;padding:0 10px;background: antiquewhite;" @click="reset()">回遊戲首頁</div>
          </div>
        </div>

        <div class="bg-mask" v-if="dispatchVisible || agreeVisible || setOffVisible || setOffResultVisible || killVisible || resultVisible" @click="dispatchVisible = false;agreeVisible = false;"></div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import roleJson from '../../assets/data/role.json';
import campJson from '../../assets/data/camp.json';

export default {
  data () {
    return {
      json: {},
      campList: {},
      step: 2,
      gameSet: {
        campId: 0,
        good: [],
        bad: [],
        order: []
      },
      cardCheckIndex: 0, // 身分確認順序
      cardChecked: false, // 是否確認過
      cardHovering: false, // 正在確認
      audioPlayStatus: false, // 音檔狀態
      dispatchVisible: false, // 隊員選擇視窗
      agreeVisible: false, // 是否同意視窗
      setOffVisible: false, // 出征任務選擇視窗
      setOffResultVisible: false, // 出征任務結果視窗
      killVisible: false, // 刺殺視窗
      resultVisible: false, // 終局視窗

      orderIndex: 0, // 隊長順序
      taskIndex: 0, // 任務順序
      taskResult: [], // 任務結果
      nowSelected: [], // 隊長選擇陣列
      voteTimes: 0, // 投票次數

      successIndex: 0, // 出征任務選擇順序
      successList: [], // 出征結果陣列

      win: null // 終局結果
    }
  },
  created() {
    this.json = roleJson
    this.campList = campJson
  },
  mounted () {
    // url query get
    let url = location.href;
    let ary1 = url.split('?');
    let ary2 = ary1[1].split('&');
    ary2.forEach((item) => {
      if (item.split('=')[0] === 'campId') {
        this.gameSet.campId = item.split('=')[1]
      } else if (item.split('=')[0] === 'good') {
        this.gameSet.good = item.split('=')[1].split('')
      } else if (item.split('=')[0] === 'bad') {
        this.gameSet.bad = item.split('=')[1].split('')
      }
    })
    for (let i = 0; i < this.gameSet.good.length; i++) {
      this.gameSet.order.push('1' + this.gameSet.good[i])
    }
    for (let i = 0; i < this.gameSet.bad.length; i++) {
      this.gameSet.order.push('0' + this.gameSet.bad[i])
    }
    // random sort
    this.gameSet.order.sort(function(){return Math.random()>0.5?-1:1;});
    console.log(this.gameSet)

    // card animate
    setTimeout(() => {
      $(".role-ckeck-section .container").hover(() => {
        this.cardChecked = true
        this.cardHovering = true
      }, () => {
        this.cardHovering = false
      })
    }, 100)
    

    // audio end action
    var aud = document.getElementById("idcheck");
    aud.onended = () => {
        this.audioPlayStatus = true
    };
  },
  methods: {
    nextPlayer () {
      if (this.cardChecked === true && this.cardCheckIndex < this.gameSet.order.length - 1) {
        this.cardCheckIndex++
        this.cardChecked = false
      } else if (this.cardChecked === false) {
        alert("請先確認身分")
      } else {
        this.step++
      }
    },
    // 選擇出征人員
    setOffSelect (index) {
      if (this.nowSelected.indexOf(index) !== -1) {
        this.nowSelected.remove(index)
      } else if (this.nowSelected.length < this.campList[this.gameSet.campId].task[this.taskIndex].num) {
        this.nowSelected.push(index)
      }
    },
    // 確定出征人員
    setOffSet () {
      if (this.nowSelected.length === this.campList[this.gameSet.campId].task[this.taskIndex].num) {
        this.nowSelected.sort(function(a,b){return a-b;});
        this.dispatchVisible= false
        this.agreeVisible= true
      } else {
        alert('需選擇' + this.campList[this.gameSet.campId].task[this.taskIndex].num + '位玩家出征')
      }
    },
    // 同意/不同意出征
    agree (res) {
      if (this.voteTimes === 4) { // 一定出征
          this.agreeVisible= false
          this.setOffVisible = true
      } else {
        if (res) { // 同意
          this.agreeVisible= false
          this.setOffVisible = true
          // 出征
        } else { // 不同意
          this.voteTimes++
          this.agreeVisible= false
          this.nowSelected = []
          this.nextLeader()
        }
      }
    },
    // 出征者出征結果選擇
    success (res) {
      this.successList.push(res)
      let num = this.campList[this.gameSet.campId].task[this.taskIndex].num // 出征人數

      if (this.successList.length === num) {

        // 出征結果 taskResult
        let condition = this.campList[this.gameSet.campId].task[this.taskIndex].failCondition
        let result = this.successList.filter(function(value) {return value === false;}).length // 失敗次數
        this.successList.sort(function(){return Math.random()>0.5?-1:1;}); // 亂序

        this.setOffVisible = false

        // 任務判斷
        this.taskResult.push(result < condition)
        this.setOffResultVisible = true

        setTimeout(() => {
          this.setOffResultVisible = false
          // 判斷遊戲狀態
          let s = this.taskResult.filter(function(value) {return value === true;}).length
          let f = this.taskResult.filter(function(value) {return value === false;}).length
          if (s === 3) {
            // 好人獲勝，進入刺殺階段
            this.killVisible = true
          } else if (f === 3) {
            // 壞人獲勝
            this.endResult(false)
          } else {
            this.nextTask()
            this.nextLeader()
          } 
        }, 5000)  
      } else { // 下一位
        this.successIndex++
      }
    },
    nextTask () {
      this.successIndex = 0
      this.successList = []
      this.nowSelected = []
      this.taskIndex++
      this.voteTimes = 0
    },
    nextLeader () {
      if (this.orderIndex === this.gameSet.order.length - 1) {
        this.orderIndex = 0
      } else {
        this.orderIndex++
      }
    },
    kill (item) {
      if (item === '11') { // 成功殺到梅林
        this.endResult(0)
      } else { // 未殺到梅林
        this.endResult(1)
      }
      this.killVisible = false
    },
    endResult (res) {
      this.win = res
      this.resultVisible = true
    },
    reset () {
      this.$router.push({path: '/'})
    }
  }
}
</script>

<style scoped>
.top-reset {
  top: 1.5%;
}
</style>
