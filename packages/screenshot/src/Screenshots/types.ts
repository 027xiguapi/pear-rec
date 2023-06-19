import { MutableRefObject } from 'react'

export type CanvasContextRef = MutableRefObject<CanvasRenderingContext2D | null>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EmiterListener = (...args: any) => unknown

export type Emiter = Record<string, EmiterListener[]>

export type EmiterRef = MutableRefObject<Emiter>

export interface Point {
  x: number
  y: number
}

export enum HistoryItemType {
  Edit,
  Source
}

export interface HistoryItemEdit<E, S> {
  type: HistoryItemType.Edit
  data: E
  source: HistoryItemSource<S, E>
}

export interface HistoryItemSource<S, E> {
  name: string
  type: HistoryItemType.Source
  data: S
  isSelected?: boolean
  editHistory: HistoryItemEdit<E, S>[]
  draw: (ctx: CanvasRenderingContext2D, action: HistoryItemSource<S, E>) => void
  isHit?: (ctx: CanvasRenderingContext2D, action: HistoryItemSource<S, E>, point: Point) => boolean
}

export type HistoryItem<S, E> = HistoryItemEdit<E, S> | HistoryItemSource<S, E>

export interface History {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stack: HistoryItem<any, any>[]
}

export interface Bounds {
  x: number
  y: number
  width: number
  height: number
}

export type Position = Point
