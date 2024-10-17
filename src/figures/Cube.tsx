import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { FC, useEffect, useRef } from 'react'
import { CellStatus } from '../types'

const cubeSides = [
  { rx: 0, ry: 0, col: "#fcc3c3" },
  { rx: 90, ry: 0, col: "#fcc3c3" },
  { rx: 180, ry: 0, col: "#fcc3c3" },
  { rx: -90, ry: 0, col: "#fcc3c3" },
  { rx: 0, ry: 90, col: "#fcc3c3" },
  { rx: 0, ry: -90, col: "#fcc3c3" },
]

type CubeProps = {
  id: string,
  cellStatus: CellStatus,
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void,
}

const Cube: FC<CubeProps> = ({ id, cellStatus, onClick }) => {
  const ref = useRef<HTMLDivElement>(null)
  const cubeAnim = useRef<gsap.core.Animation>()
  const selectSide = useRef<gsap.core.Animation>()
  const completeSide = useRef<gsap.core.Animation>()

  useGSAP(() => {
    gsap
    .set(".side", {
      rotateY: (i) => cubeSides[i%cubeSides.length].ry,
      rotateX: (i) => cubeSides[i%cubeSides.length].rx,
      transformOrigin: "50% 50% -150px",
      z: 150,
      backgroundColor: (i) => cubeSides[i%cubeSides.length].col,
    })

    if (!ref?.current) return
    cubeAnim.current = gsap
    .fromTo(ref?.current, {
      paused: true,
      scale: 0.3,
      scaleZ: 0.3
    }, {
      paused: true,
      scale: 0.4,
      scaleZ: 0.4,
      rotateY: 180,
    })
    selectSide.current = gsap.to(ref?.current?.children || null, {
      paused: true,
      backgroundColor: "#bee3f5",
    })
    completeSide.current = gsap.to(ref?.current?.children || null, {
      paused: true,
      backgroundColor: "#fddc5c",
    })
  })

  useEffect(() => {
    if (!ref?.current) return

    if (cellStatus === CellStatus.Selected) {
      cubeAnim.current?.play()
      selectSide.current?.play()
    } else if (cellStatus === CellStatus.Completed) {
      cubeAnim.current?.reverse()
      completeSide.current?.play()
    } else {
      cubeAnim.current?.reverse()
      selectSide.current?.reverse()
    }
  }, [cellStatus])

  return (
      <div className="cube" id={id} ref={ref} onClick={onClick}>
        {cubeSides.map((_, i) => <div key={id+i} className="side"/>)}
      </div>
  )
}

export default Cube