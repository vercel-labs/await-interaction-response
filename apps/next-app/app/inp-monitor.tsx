'use client'

import { useEffect } from 'react'
import { createInpRecorder } from '@vercel/inp'
import { track } from '@vercel/analytics'
import { onLCP, onINP, onCLS } from 'web-vitals'

export function InpMonitor() {
  useEffect(() => {
    const recorder = createInpRecorder({ debug: false })
    if (!recorder) return

    onINP(
      (metric) => {
        console.log('ON_INP', metric)
      },
      { reportAllChanges: true },
    )
    // onLCP((metric) => {
    //   console.log('ON_LCP', metric)
    // })
    // onCLS((metric) => {
    //   console.log('ON_CLS', metric)
    // })

    recorder.subscribe((entry) => {
      const isAppRouter = Boolean((window as any).next.appDir)
      const { duration, event } = entry

      if (duration < 200) return

      const path = getSelector(entry.target)
      const slowestEvent = (
        [
          ['input delay', entry.inputDelay || 0],
          ['render', entry.presentationDelay],
          [event, entry.processingDuration],
        ] as const
      ).reduce((acc, timing) => (acc[1] > timing[1] ? acc : timing))[0]
      const pathWithEvent = `${path} : ${slowestEvent}`
      const pathWithLongestDuration = `${path} : ${event}`
      const data = {
        path,
        event,
        pathWithEvent,
        pathWithLongestDuration,
        isAppRouter,
        chrome: isChrome(),
        android: isAndroid(),
      }

      if (process.env.NODE_ENV === 'production') {
        track('long-inp-200', data)
        if (duration < 400) {
          return
        }
        track('long-inp-400', data)
      } else {
        console.log('INP ENTRY', entry, data)
      }
    })

    return () => {
      recorder.cleanup()
    }
  }, [])
  return null
}

function getSelector(el: HTMLElement): string {
  let element: HTMLElement | null = el
  const path: string[] = []

  while (element) {
    const name = element.tagName.toLowerCase()
    if (name === 'body') break

    if (element.id) {
      path.unshift(`${name}#${element.id}`)
      continue
    }

    const testId = element.getAttribute('data-testid')
    if (testId) {
      path.unshift(`${name}[data-testid="${testId}"]`)
      continue
    }

    path.unshift(name)
    element = element.parentElement
  }

  return path.join(' > ')
}

function isChrome(): boolean {
  return navigator.userAgent.includes('Chrome')
}

function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent)
}
