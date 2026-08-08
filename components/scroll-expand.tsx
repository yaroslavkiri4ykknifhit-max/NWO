"use client"

import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react"

const clamp = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0 || 0.000001), 0, 1)
  return t * t * (3 - 2 * t)
}

type ScrollExpandProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  src?: string
  mobileSrc?: string
  mediaType?: "image" | "video" | "custom"
  poster?: string
  alt?: string
  title?: string
  scrollHint?: string
  startWidth?: number
  startHeight?: number
  startRadius?: number
  endRadius?: number
  mediaZoom?: number
  scrollDistance?: number
  holdDistance?: number
  smoothing?: number
  overlayScrim?: number
  useWindowScroll?: boolean
  enabled?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export default function ScrollExpand({
  src = "",
  mobileSrc = "",
  mediaType = "image",
  poster = "",
  alt = "",
  title = "",
  scrollHint = "",
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = false,
  enabled = true,
  children,
  className = "",
  style,
  ...rest
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const propsRef = useRef({
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
  })

  propsRef.current = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
  }

  const applyProgress = useCallback((progress: number) => {
    const frame = frameRef.current
    const media = mediaRef.current
    if (!frame || !media) return

    const config = propsRef.current
    const eased = smoothstep(0, 1, progress)
    const width = config.startWidth + (100 - config.startWidth) * eased
    const height = config.startHeight + (100 - config.startHeight) * eased
    const insetX = Math.max(0, (100 - width) / 2)
    const insetY = Math.max(0, (100 - height) / 2)
    const radius = config.startRadius + (config.endRadius - config.startRadius) * eased

    frame.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`
    media.style.transform = `scale(${config.mediaZoom + (1 - config.mediaZoom) * eased})`

    if (scrimRef.current) {
      scrimRef.current.style.opacity = String(config.overlayScrim * eased)
    }

    if (titleRef.current) {
      const out = smoothstep(0.34, 0.82, progress)
      titleRef.current.style.opacity = String(1 - out)
      titleRef.current.style.transform = `translate3d(0, ${-30 * out}px, 0) scale(${1 + 0.08 * out})`
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, progress)
      hintRef.current.style.opacity = String(1 - gone)
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`
    }

    if (overlayRef.current) {
      const visible = smoothstep(0.68, 1, progress)
      overlayRef.current.style.opacity = String(visible)
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - visible)}px, 0)`
      overlayRef.current.style.pointerEvents = visible > 0.92 ? "auto" : "none"
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    const stage = stageRef.current
    if (!root || !track || !stage) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches
    let animationFrame = 0
    let current = 0
    let target = 0
    let stageHeight = 0
    let measuredWidth = 0
    let running = false

    const measure = (force = false) => {
      const config = propsRef.current
      const nextWidth = Math.round(root.getBoundingClientRect().width || window.innerWidth)
      const widthChanged = Math.abs(nextWidth - measuredWidth) >= 8
      const mobileViewport = window.matchMedia("(max-width: 760px)").matches

      // Mobile browsers resize the visual viewport whenever their address bar
      // opens or closes. Rebuilding the sticky track for that height-only
      // change moves the document underneath the user's finger.
      if (
        !force &&
        config.useWindowScroll &&
        mobileViewport &&
        measuredWidth > 0 &&
        !widthChanged
      ) {
        return false
      }

      measuredWidth = nextWidth
      const nextHeight = config.useWindowScroll
        ? Math.round(document.documentElement.clientHeight || window.innerHeight)
        : Math.round(root.clientHeight)
      if (nextHeight <= 0) return false

      stageHeight = nextHeight

      stage.style.height = `${stageHeight}px`
      track.style.height = `${stageHeight * (1 + Math.max(0, config.scrollDistance) + Math.max(0, config.holdDistance))}px`
      return true
    }

    const readProgress = () => {
      const config = propsRef.current
      if (!config.enabled) return 1
      const span = stageHeight * Math.max(0.01, config.scrollDistance)
      if (config.useWindowScroll) {
        return clamp(-track.getBoundingClientRect().top / span, 0, 1)
      }
      return clamp(root.scrollTop / span, 0, 1)
    }

    const tick = () => {
      const config = propsRef.current
      const effectiveSmoothing = coarsePointer ? 0 : config.smoothing
      const follow = effectiveSmoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * effectiveSmoothing))
      current += (target - current) * follow

      if (Math.abs(target - current) < 0.0004) {
        current = target
        running = false
      }

      applyProgress(current)
      animationFrame = running ? window.requestAnimationFrame(tick) : 0
    }

    const kick = () => {
      if (running) return
      running = true
      if (!animationFrame) animationFrame = window.requestAnimationFrame(tick)
    }

    const handleScroll = () => {
      target = readProgress()
      if (coarsePointer || propsRef.current.smoothing <= 0 || reduceMotion) {
        if (animationFrame) window.cancelAnimationFrame(animationFrame)
        animationFrame = 0
        running = false
        current = target
        applyProgress(current)
        return
      }
      kick()
    }

    const handleResize = () => {
      if (!measure()) return
      target = readProgress()
      current = target
      applyProgress(current)
    }

    measure(true)
    target = readProgress()
    current = target
    applyProgress(current)

    const scroller: Window | HTMLDivElement = useWindowScroll ? window : root
    scroller.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize)
    const resizeObserver = useWindowScroll ? null : new ResizeObserver(handleResize)
    resizeObserver?.observe(root)

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      scroller.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      resizeObserver?.disconnect()
    }
  }, [applyProgress, useWindowScroll])

  const assignMedia = (node: HTMLElement | null) => {
    mediaRef.current = node
  }

  const media = mediaType === "custom" ? (
    <div ref={assignMedia} className="scroll-expand__media scroll-expand__media--custom" />
  ) : mediaType === "video" ? (
    <video
      ref={assignMedia}
      className="scroll-expand__media"
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
    >
      {mobileSrc ? <source media="(max-width: 760px)" src={mobileSrc} /> : null}
      <source src={src} />
    </video>
  ) : mobileSrc ? (
    <picture className="scroll-expand__picture">
      <source media="(max-width: 760px)" srcSet={mobileSrc} />
      <img ref={assignMedia} className="scroll-expand__media" src={src} alt={alt} draggable={false} />
    </picture>
  ) : (
    <img ref={assignMedia} className="scroll-expand__media" src={src} alt={alt} draggable={false} />
  )

  return (
    <div
      ref={rootRef}
      className={`scroll-expand ${useWindowScroll ? "" : "scroll-expand--scroller"} ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            {media}
            <div ref={scrimRef} className="scroll-expand__scrim" />
            {children ? (
              <div ref={overlayRef} className="scroll-expand__overlay">
                {children}
              </div>
            ) : null}
          </div>
          {title ? <div ref={titleRef} className="scroll-expand__title">{title}</div> : null}
          {scrollHint ? <div ref={hintRef} className="scroll-expand__hint">{scrollHint}</div> : null}
        </div>
      </div>
    </div>
  )
}
