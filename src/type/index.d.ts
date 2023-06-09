export type TEXT_TYPE = 0 | 1
export interface DATA_TEXT {
  type: TEXT_TYPE
  startTime?: number
  endTime?: number
  text?: string
  color?: string
  fontSize?: number
  left: number
  top: number
  stroke: number
  strokeColor: string
}
export interface DATA_IMG {
  startTime?: number
  endTime?: number
  img?: string
  left: number
  top: number
  rotation: number
  scale: number
}

export type PERSON_TEXT = Partial<DATA_TEXT>
export type PERSON_IMG = Partial<DATA_IMG>

export type SUBTITLE = {
  text: string
  color: string
  fontSize: number
  top: number
  left: number
  stroke: number
  strokeColor: string
  data: {
    startTime: number
    endTime: number
    text: string
  }[]
}
export interface DATA {
  videoFile: File
  partition: { startTime: number; endTime: number }
  text: DATA_TEXT[]
  subtitle: SUBTITLE[]
  img: DATA_IMG[]
}
export interface TEMPORARY {
  firstImage: string
  url: string
  currentTime: number
  timeEnd: number
}

export interface VIDEO_DATA {
  data: DATA[]
  temporary: TEMPORARY[]
  currentIndex: number
  boxIndex: 1 | 2 | 3 | 4
  textIndex: number
  imgIndex: number
  subtitleIndex: number
  statusMap: string[]
}
