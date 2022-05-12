import { useCallback, useEffect, useReducer, useRef } from 'react'

type Coordinate = [number, number]

type Snake = Coordinate[]

type SnakeMap = {
    [key: number]: {
        [key: number]: true
    }
}

type Game = {
    alive: boolean
    snake: Snake
    snakeMap: SnakeMap
    food: Coordinate | null
    score: number
}

type Direction = 'n' | 's' | 'e' | 'w'

const offsets: Record<Direction, Coordinate> = {
    n: [0, 1],
    s: [0, -1],
    e: [1, 0],
    w: [-1, 0]
}

const equals = (a: Coordinate, b: Coordinate) => a[0] === b[0] && a[1] === b[1]

const randomIndex = (length: number) => Math.trunc(Math.random() * length)

const addToSnakeMap = (map: SnakeMap, [x, y]: Coordinate) => {
    map[x] = map[x] || {}
    map[x][y] = true
}

const removeFromSnakeMap = (map: SnakeMap, [x, y]: Coordinate) => {
    const row = map[x]
    delete row[y]
}

export default function useSnake(boardSize: number, speed: number) {
    const start = Math.trunc(boardSize / 2)

    const [game, moveSnake] = useReducer(
        ({ snake, snakeMap, alive, food, score }: Game, direction: Direction) => {
            const [[x, y]] = snake
            const [dX, dY] = offsets[direction]
            const head: Coordinate = [x + dX, y + dY]

            if (head.find((coord) => coord < 0 || coord >= boardSize) || snake.find((part) => equals(part, head))) {
                alive = false
            } else {
                snake = [head, ...snake]
                addToSnakeMap(snakeMap, head)

                if (food && equals(food, head)) {
                    score++
                    food = null
                } else {
                    removeFromSnakeMap(snakeMap, snake.pop())

                    if (food === null && Math.random() > 1 / 3) {
                        const openCoords: Coordinate[] = []

                        for (let i = 0; i < boardSize; i++) {
                            for (let j = 0; j < boardSize; j++) {
                                if (!snakeMap[i] || !snakeMap[i][j]) {
                                    openCoords.push([i, j])
                                }
                            }
                        }
                        food = openCoords[randomIndex(openCoords.length)]
                    }
                }
            }

            return {
                snake,
                snakeMap,
                alive,
                food,
                score
            }
        },
        {
            snake: [[start, start]],
            snakeMap: {
                [start]: {
                    [start]: true
                }
            },
            alive: true,
            food: null,
            score: 0
        }
    )

    const directionRef = useRef<Direction>('s')

    const updateDirection = useCallback((dir: Direction) => (directionRef.current = dir), [directionRef])

    const { alive } = game

    useEffect(() => {
        if (alive) {
            const interval = setInterval(() => {
                moveSnake(directionRef.current)
            }, speed)

            return () => clearInterval(interval)
        }
    }, [speed, alive])

    return {
        updateDirection,
        direction: directionRef.current,
        ...game
    }
}
