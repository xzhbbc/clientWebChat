<template>
  <div class="chat-concats">
    <div class="chat-panel">
      <div @click="foucus(index)" v-for="(item,index) in concat" :key="index+item.meg+item.time" class="chat-item" :class="{'focus':index==nowIndex}">
        <img class="avatar" src="../../../../static/13.jpg">
        <div class="top-bottom">
          <div class="name-time">
            <p class="name">{{item.name}}</p>
            <p class="time">{{item.time}}</p>
          </div>
          <div class="preview-unread">
            <p class="preview">{{item.meg}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    concat: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      nowIndex: 0
    }
  },
  methods: {
    foucus(index) {
      this.nowIndex = index
      this.$emit('changeIndex', index)
    }
  }
}
</script>

<style lang="less">
.chat-concats {
  width: 300px;
  height: 100%;
  background-color: rgba(74, 144, 256, 0.5);
  position: relative;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  .chat-panel {
    flex: 1;
    overflow-y: auto;
    z-index: 1;
    .chat-item {
      height: 90px;
      display: flex;
      align-items: center;
      padding: 10px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 24px;
      }
      .top-bottom {
        flex: 1;
        margin-left: 12px;
        .name-time {
          margin-top: 4px;
          .name {
            color: #f7f7f7;
            font-size: 14px;
          }
          .time {
            color: #f7f7f7b3;
            font-size: 12px;
            position: relative;
            top: 4px;
          }
        }
        .preview-unread {
          margin-top: 6px;
          display: flex;
          justify-content: space-between;
          .preview {
            color: #f7f7f7b3;
            font-size: 12px;
            width: 188px;
            height: 20px;
            line-height: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .focus {
      background-color: #71a7e5;
    }
  }
}
</style>

