<template>
  <div class="chat-message text"><img class="component-avatar avatar" src="../../../../static/13.jpg" style="width: 44px; height: 44px; border-radius: 22px;">
    <div class="right">
      <div class="nickname-time">
        <span class="tag" style="display: none;"></span>
        <span class="nickname">{{concat.name}}</span>
        <span class="time">{{concat.time}}</span>
      </div>
      <div class="content">
        <div class="text">{{concat.meg}}</div>
      </div>
      <div class="arrow"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    concat: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>


<style lang="less">
.chat-message {
  display: flex;
  margin-right: 54px;
  margin-bottom: 10px;
  position: relative;
  .avatar {
    min-width: 44px;
  }
  .right {
    margin-left: 12px;
    .nickname-time {
      height: 20px;
      display: flex;
      align-items: flex-end;
      .tag {
        height: 18px;
        line-height: 18px;
        display: inline-block;
        font-size: 10px;
        background-color: rgba(74, 144, 226, 0.9);
        color: rgba(247, 247, 247, 1);
        transform: translateY(-1px);
        border-radius: 8px;
        padding: 0px 6px;
      }
      .nickname {
        color: rgb(51, 51, 51);
        font-size: 13px;
        margin-left: 6px;
        user-select: text;
      }
      .time {
        color: rgb(102, 102, 102);
        font-size: 12px;
        margin-left: 8px;
      }
    }

    .content {
      display: inline-block;
      color: rgb(85, 85, 85);
      font-size: 14px;
      background-color: rgba(255, 255, 255, 0.8);
      min-height: 28px;
      margin-top: 3px;
      padding: 6px 8px;
      border-radius: 0px 8px 8px;
      .text {
        line-height: 30px;
        word-break: break-word;
      }
    }
    .arrow {
      width: 0px;
      height: 0px;
      position: absolute;
      top: 23px;
      left: 49px;
      border-style: solid;
      border-width: 0px 7px 15px 0px;
      border-color: transparent rgba(255, 255, 255, 0.8) transparent transparent;
    }
  }
}
</style>
