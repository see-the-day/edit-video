<template>
  <div class="flex h-0 min-h-200 flex-1 items-center justify-center">
    <div class="relative">
      <video
        ref="myVideo"
        :controls="false"
        class="w-460"
        preload="auto"
        muted
        :src="url"
      ></video>
      <layerList class="absolute bottom-0 left-0 right-0 top-0"></layerList>
    </div>
  </div>
  <div class="flex justify-center border-t pb-6 pt-6">
    <n-tooltip trigger="hover">
      <template #trigger>
        <img
          class="h-16 w-16 cursor-pointer"
          :src="isPlay ? playPng : pausePng"
          @click="play"
        />
      </template>
      {{ isPlay ? '暂停' : '播放' }}
    </n-tooltip>
    <n-tooltip trigger="hover">
      <template #trigger>
        <img
          class="ml-12 h-16 w-16 cursor-pointer"
          src="@/assets/cutting.png"
          @click="cutting"
        />
      </template>
      裁剪
    </n-tooltip>
    <preview class="ml-12"></preview>
    <exportVue class="ml-12"></exportVue>
  </div>
  <div class="relative h-244 w-full border-t">
    <timeLine v-model="currentTime"></timeLine>
    <trackVue></trackVue>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { NTooltip } from 'naive-ui'
import timeLine from './timeLine.vue'
import { useState } from '@/store/videoState'
import playPng from '@/assets/play.png'
import pausePng from '@/assets/pause.png'
import layerList from './layerList.vue'
import trackVue from './track.vue'
import exportVue from './export.vue'
import preview from './preview.vue'

const myVideo = ref<HTMLVideoElement>({} as HTMLVideoElement)
const state = useState()
// 当前帧转成图片
const setImg = () => {
  myVideo.value.pause()
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = myVideo.value.videoWidth
  canvas.height = myVideo.value.videoHeight
  ctx?.drawImage(
    // eslint-disable-next-line no-undef
    myVideo.value as CanvasImageSource,
    0,
    0,
    canvas.width,
    canvas.height
  )
  const imgBase64 = canvas.toDataURL('image/png')
  state.STE_VIDEO_URL(imgBase64)
}
const getFirstImg = (startTime?: number) => {
  myVideo.value.currentTime = startTime || state.getStartTime
  if (state.temporary[state.currentIndex].firstImage) return
  myVideo.value?.addEventListener('canplay', setImg)
}

// 文件加载完成获取总时间
const timeEnd = ref(0)
const getDuration = () => {
  const { duration } = myVideo.value // 获取当前播放时间

  getFirstImg()

  // 如果当前传入时间为0，则默认当前视频时间
  if (!timeEnd.value) {
    timeEnd.value = duration
    state.ADD_TIME(0, Math.ceil(duration))
  }
}
const getVideoDate = () => {
  myVideo.value.addEventListener('loadedmetadata', getDuration)
}

const isPlay = ref(false)
const play = () => {
  myVideo.value[isPlay.value ? 'pause' : 'play']()
  isPlay.value = !isPlay.value
}

const url = computed(() => state.temporary[state.currentIndex]?.url)

const startTime = computed(() => state.getStartTime)
const endTime = computed(() => state.getEndTime)
const currentTime = ref(0)
const getVideoTime = () => {
  if (!url.value) return
  currentTime.value = myVideo.value.currentTime
  state.ADD_TIME(currentTime.value, Math.ceil(timeEnd.value))
  if (currentTime.value >= endTime.value) {
    currentTime.value = startTime.value
    myVideo.value.currentTime = startTime.value
    play()
  }
}
const getVideoCurrentTime = () => {
  myVideo.value.addEventListener('timeupdate', getVideoTime)
}

const clearListener = () => {
  myVideo.value.removeEventListener('timeupdate', getVideoTime, false)
  myVideo.value.removeEventListener('loadedmetadata', getDuration, false)
  myVideo.value?.removeEventListener('canplay', setImg, false)
}
watch(
  () => state.currentIndex,
  () => {
    myVideo.value.currentTime = startTime.value
  }
)
watch(url, () => {
  if (url.value) {
    clearListener()
    getVideoDate()
    getVideoCurrentTime()
  }
})

const cutting = () => {
  state.PARTITION_CHANGE()
  const { videoFile } = state.data[state.currentIndex]
  const { url } = state.temporary[state.currentIndex]
  state.SET_VIDEO(url, videoFile, currentTime.value, timeEnd.value)
  getFirstImg(currentTime.value)
  play()
}
</script>
