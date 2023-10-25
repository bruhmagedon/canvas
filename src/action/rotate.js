import { useContext } from "react";
import { ModelContext } from "../app/App";

import { Range } from "../UI/range/Range";

import { multiply } from "mathjs";

export const Rotate = () => {
    const modelRotate = (matrix, angle, axis) => {
        let radianAngle = (Math.PI / 180) * angle;

        if (axis === "x") {
            let rotationMatrixX = [
                [1, 0, 0, 0],
                [0, Math.cos(radianAngle), -Math.sin(radianAngle), 0],
                [0, Math.sin(radianAngle), Math.cos(radianAngle), 0],
                [0, 0, 0, 1],
            ];

            return multiply(matrix, rotationMatrixX);
        } else if (axis === "y") {
            let rotationMatrixY = [
                [Math.cos(radianAngle), 0, Math.sin(radianAngle), 0],
                [0, 1, 0, 0],
                [-Math.sin(radianAngle), 0, Math.cos(radianAngle), 0],
                [0, 0, 0, 1],
            ];

            return multiply(matrix, rotationMatrixY);
        } else {
            let rotationMatrixZ = [
                [Math.cos(radianAngle), -Math.sin(radianAngle), 0, 0],
                [Math.sin(radianAngle), Math.cos(radianAngle), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1],
            ];

            return multiply(matrix, rotationMatrixZ);
        }
    };

    return { modelRotate };
};

export const ModelRotate = () => {
    const { status, setStatus, setDrawModel, actionModel, setActionModel } =
        useContext(ModelContext);

    const { modelRotate } = Rotate();

    const onAction = (e) => {
        const angle = e.target.value;
        const axis = e.target.getAttribute("view");

        const rotateMatrix = modelRotate(actionModel, angle, axis);

        setActionModel(rotateMatrix);

        setDrawModel((model) => ({ ...model, matrixModel: rotateMatrix }));
    };

    return (
        <>
            <button
                className="buttons-panel-button"
                onClick={() => setStatus("rotate")}
            >
                Повернуть
            </button>
            {status === "rotate" ? <RotateRanges onAction={onAction} /> : null}
        </>
    );
};

// рендер ползунков
const RotateRanges = ({ onAction }) => {
    return (
        <>
            <p className="axisText">x</p>
            <Range view="x" type="rotate" onAction={onAction} />
            <p className="axisText">y</p>
            <Range view="y" type="rotate" onAction={onAction} />
            <p className="axisText">z</p>
            <Range view="z" type="rotate" onAction={onAction} />
        </>
    );
};
