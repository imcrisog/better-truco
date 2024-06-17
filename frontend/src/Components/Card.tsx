import { useState, useEffect, useRef } from "react";

export default function Card({ mx, my }: 
        { mx: number, my: number }
    ) {

    const canvasRef1 = useRef<HTMLCanvasElement>(null)
    const [url, setUrl] = useState<string>('http://localhost:3000/baraja.png')
    const drawImage = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, mx: number, my: number) => {

        // MY: 0 = Oro, 1 = Copa, 2 = Espada, 3 = Basto, 1,4 = Default
        ctx.drawImage(image,
            207 * mx, 319 * my,
            210, 320,
            0, 0,
            130, 200
        )        
    }

    useEffect(() => {

        const image = new Image()
        image.src = url
        const canvas = canvasRef1.current!
        const context = canvas.getContext('2d')!

        drawImage(context, image, mx, my)

    },[])

    return (
        <canvas ref={canvasRef1} height="200px" width="400px" />
    )
}