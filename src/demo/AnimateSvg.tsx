import gsap from "gsap";
import { useEffect, useRef } from "react"
import "./AnimateSvg.css"

type customSVGCircleElement = SVGCircleElement & { line: SVGLineElement, ori_x: number, ori_y: number, animater: gsap.core.Timeline }

const AnimateSvg = () => {
    const containerRef = useRef<SVGSVGElement | null>(null)
    let width = 0, height = 0, left = 0, top = 0, lines = 10, rows = 10, mouseRadius = 100;
    let balls: customSVGCircleElement[] = [];

    const resize = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            width = rect.width
            height = rect.height
            left = rect.left
            top = rect.top
        }
    }

    const createBround = (radius: number) => {
        for (let i = 0; i <= lines; i++) {
            for (let j = 0; j <= rows; j++) {
                let x = width / rows * i;
                let y = height / lines * j;
                const ball = document.createElementNS("http://www.w3.org/2000/svg", "circle") as customSVGCircleElement;
                ball.setAttribute("fill", "#17f700");
                ball.setAttribute("cx", `${x}`);
                ball.setAttribute("cy", `${y}`);
                ball.setAttribute("r", `${radius}`);
                const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                point.setAttribute("fill", "#f7f7f7");
                point.setAttribute("cx", `${x}`);
                point.setAttribute("cy", `${y}`);
                point.setAttribute("r", `${radius / 5}`);
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
                line.setAttribute('x1', `${x}`)
                line.setAttribute('y1', `${y}`)
                line.setAttribute('x2', `${x}`)
                line.setAttribute('y2', `${y}`)
                containerRef.current?.appendChild(line);
                containerRef.current?.appendChild(point);
                containerRef.current?.appendChild(ball);
                ball.line = line
                ball.ori_x = x
                ball.ori_y = y
                balls.push(ball)
            }
        }
    }
    const moveBalls = (x: number, y: number) => {
        const mouse_x = x - left;
        const mouse_y = y - top;
        balls.forEach((ball) => {
            const dx = ball.ori_x - mouse_x
            const dy = ball.ori_y - mouse_y
            const distance = Math.sqrt(dx ** 2 + dy ** 2);
            if (distance <= mouseRadius) {
                const move_x = mouse_x + dx / distance * mouseRadius
                const move_y = mouse_y + dy / distance * mouseRadius
                if (ball.animater) ball.animater.kill();
                ball.animater = gsap.timeline().to(ball, {
                    attr: {
                        cx: move_x,
                        cy: move_y
                    },
                    duration: 0.5,
                    ease: "power3.out"
                }).to(ball.line, {
                    attr: {
                        x2: move_x,
                        y2: move_y
                    },
                    duration: 0.5,
                    ease: "power3.out"
                }, "<").to(ball, {
                    attr: {
                        cx: ball.ori_x,
                        cy: ball.ori_y
                    },
                    duration: 1,
                    ease: "power3.out"
                }, "<0.1").to(ball.line, {
                    attr: {
                        x2: ball.ori_x,
                        y2: ball.ori_y
                    },
                    duration: 1,
                    ease: "power3.out"
                }, "<")
            }
        })
    }

    const init = () => {
        resize()
        createBround(20)
        document.addEventListener("mousemove", (e) => {
            moveBalls(e.x, e.y)
        })
    }

    useEffect(() => {
        if (containerRef.current) {
            init()
        }
        document.addEventListener("scroll", resize)
        return () => {
            document.removeEventListener("scroll", resize)
            document.removeEventListener("mousemove", (e) => {
                moveBalls(e.x, e.y)
            })
        }
    }, [containerRef.current])

    return (
        <div className="animate-svg">
            <svg ref={containerRef} className="container"></svg>
        </div>
    )
}
export default AnimateSvg