<template>
    <div>
        聊天页
    </div>
</template>

<script>
import io from 'socket.io-client'

export default {
    created() {
        const socket = io('ws://localhost:3005')
        socket.emit('login', {
            name: 'xzh'
        })
    }
}
</script>

<style>
</style>

