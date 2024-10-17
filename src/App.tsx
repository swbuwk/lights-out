import { useGSAP } from "@gsap/react";
import gsap from "gsap"
import { ScrollTrigger, CustomEase, clamp } from "gsap/all";
import Cube from "./figures/Cube";
import { scaleZ } from "./plugins/scaleZ";
import { useCallback, useRef, useState } from "react";
import { CellStatus } from "./types";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger) 
gsap.registerPlugin(CustomEase) 
gsap.registerPlugin(scaleZ);

const GRID_WIDTH = 5;
const GRID_HEIGHT = 5;

function App() {
  const [gridWidth, setGridWidth] = useState<number>(GRID_WIDTH)
  const [gridHeight, setGridHeight] = useState<number>(GRID_HEIGHT)
  const [grid, setGrid] = useState<CellStatus[][]>(Array(gridHeight).fill(0).map(() => Array(gridWidth).fill(0)));
  const startGame = useRef<gsap.core.Timeline>()
  const completeGame = useRef<gsap.core.Animation>()
  const [started, setStarted] = useState<boolean>(false)

  useGSAP(
    () => {
      startGame.current = gsap
      .timeline({
        paused: true
      })
      .to("#cube", {
        scale: 0.25,
        scaleZ: 0.25,
        ease: "power3.out",
        duration: 1.5,
      })
      .to("#cube", {
        rotation: 180,
        rotateY: 90,
        scale: 0.3,
        scaleZ: 0.3,
        delay: -0.5,
        y: i => Math.floor(i/gridWidth) * 150 - 75*(gridHeight-1),
        x: i => i%gridWidth * 150 - 75*(gridWidth-1),
      })

      completeGame.current = gsap
      .to("#cube", {
        paused: true,
        ease: CustomEase.create("custom", "M0,0 C0.61,-0.67 0.22,1.5 1,1 "),
        stagger: {
          from: "center",
          amount: 0.5,
        },
        rotateY: 180,
        scale: 0.3,
        scaleZ: 0.3,
        y: i => Math.floor(i/gridWidth) * 100 - 50*(gridHeight-1),
        x: i => i%gridWidth * 100 - 50*(gridWidth-1),
      })

      gsap.set(".container", {
        zIndex: i => 100-i
      })      
    }, [gridWidth, gridHeight]
  )

  const handleCubeClick = useCallback((x: number, y: number) => {
    if (!started || grid[x][y] === CellStatus.Completed) return

    grid[x][y] = +!grid[x][y];

    if (x !== gridHeight-1) {
      grid[x+1][y] = +!grid[x+1][y];
    }
    if (x !== 0) {
      grid[x-1][y] = +!grid[x-1][y];
    }

    if (y !== gridWidth-1) {
      grid[x][y+1] = +!grid[x][y+1];
    }
    if (y !== 0) {
      grid[x][y-1] = +!grid[x][y-1];
    }

    setGrid([...grid]);
    
    if (grid.every(line => line.every(cell => cell === CellStatus.Selected))) {
      setTimeout(() => {
        const newGrid = grid.map(line => line.map(() => CellStatus.Completed));
        setGrid(newGrid);
        completeGame.current?.play()
      }, 500)
    }
  }, [started, grid, gridHeight, gridWidth])

  const handleGridChange = (w: number, h: number) => {
    const width = clamp(1, 9, w)
    const height = clamp(1, 9, h)
    setGridWidth(width)
    setGridHeight(height)
    setGrid(Array(height).fill(0).map(() => Array(width).fill(0)))
  }

  const handleStart = () => {
    startGame.current?.play()
    setStarted(true)
  }
  
  return (
    <div className="game">
      <div className="container">
        {Array(gridWidth*gridHeight).fill(0).map((_, i) => {
          const x = Math.floor(i/gridWidth);
          const y = i%gridWidth;
          return <Cube 
            key={i} 
            id={"cube"} 
            onClick={() => handleCubeClick(x, y)}
            cellStatus={grid[x][y]} 
          />
        })}
      </div>
      {!started && 
        <div className="game__options">
          <button onClick={handleStart} className="game__start-button">
            <span className="game__start-button-text" id="buttonText">START</span>
          </button>
          <div className="game__grid-size">
            <span>SIZE</span>
            <input type="number" min={0} max={9} maxLength={1} value={gridWidth} onChange={(e) => handleGridChange(+e.target.value, gridHeight)}/>
            <span>x</span>
            <input type="number" min={0} max={9} maxLength={1} value={gridHeight} onChange={(e) => handleGridChange(gridWidth, +e.target.value)}/>
          </div>
        </div>
      }
    </div>
  )
}

export default App
