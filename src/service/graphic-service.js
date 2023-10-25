import { useState, useRef, useEffect, useContext } from "react";
import { multiply } from "mathjs";
import { ModelContext } from "../app/App";

export const Service = () => {
    const x = 0,
        y = 1;
    // состояние полотна и контекст
    const [canvas, setCanvas] = useState(null);
    const [ctx, setCanvasContext] = useState(null);
    const saveCanvasSettings = ({ canvas, ctx }) => {
        setCanvas(canvas);
        setCanvasContext(ctx);
    };

    useEffect(() => {
        if (canvas) {
        }
    }, [canvas]);

    const clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const drawAxis = () => {
        const center = [canvas.width / 2, canvas.height / 2, 0];
        ctx.beginPath();
        ctx.moveTo(center[0], center[1]);
        ctx.lineTo(center[0], center[1] - 200);

        ctx.moveTo(center[0], center[1]);
        ctx.lineTo(center[0] + 200, center[1]);

        ctx.moveTo(center[0], center[1]);
        ctx.lineTo(center[0] - 150, center[1] + 150);

        ctx.closePath();
        ctx.lineWidth = 0.1;
        ctx.strokeStyle = "black";
        ctx.stroke();
    };

    const drawModel = (matrix, edges) => {
        clearCanvas();
        // drawAxis();
        // из мировых в экранные
        const localMatrix = coordConvert(matrix, 15);
        // и рисуем
        for (let edge of edges) {
            ctx.beginPath();
            ctx.moveTo(localMatrix[edge[0]][x], localMatrix[edge[0]][y]);
            ctx.lineTo(localMatrix[edge[1]][x], localMatrix[edge[1]][y]);
            ctx.closePath();
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    };

    const coordConvert = (dwarfMatrix, scale) => {
        // масштаб
        const scaleC = [
            [scale, 0, 0, 0],
            [0, scale, 0, 0],
            [0, 0, scale, 0],
            [0, 0, 0, 1],
        ];
        // центрирование
        const convertMatrix = multiply(dwarfMatrix, scaleC);
        for (const bodyPart of convertMatrix) {
            bodyPart[0] += canvas.width / 2;
            bodyPart[1] += canvas.height / 2;
        }
        return convertMatrix;
    };

    return {
        saveCanvasSettings,
        drawModel,
    };
};

export const Canvas = () => {
    const canvasRef = useRef(null);
    const modelContext = useContext(ModelContext);
    const {
        drawModel: { matrixModel, edges },
    } = modelContext;
    const { saveCanvasSettings, drawModel } = Service();

    //! канвас сохраняется при первом рендере полотна
    useEffect(() => {
        saveCanvasSettings({
            canvas: canvasRef.current,
            ctx: canvasRef.current.getContext("2d"),
        });
        // eslint-disable-next-line
    }, []);

    //! обновляемая модель, которая приходит из вне, затем рисуется в сервисе
    useEffect(() => {
        if (matrixModel) {
            drawModel(matrixModel, edges);
        }
        // eslint-disable-next-line
    }, [matrixModel]);

    return (
        <>
            <canvas
                width={800}
                height={800}
                ref={canvasRef} //ссылка на элемент
                className="canvas"
            ></canvas>
        </>
    );
};
