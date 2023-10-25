import { useContext, useState } from "react";
import { ModelContext } from "../app/App";
import { useModel } from "../model/model";

import { multiply } from "mathjs";

export const Draw = () => {};

export const ModelDraw = ({ statusDraw: { statusDraw, setStatusDraw } }) => {
    const { matrixModel, edges } = useModel();

    const { setStatus, setDrawModel, setActionModel } =
        useContext(ModelContext);

    const [projStatus, setProjStatus] = useState(1);

    const onProjection = () => {
        let projMatrix;
        if (projStatus === 1) {
            setProjStatus(2);
            const projXMatrix = [
                // матрица маштабирования
                [1, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 1],
            ];
            projMatrix = multiply(matrixModel, projXMatrix);
        } else if (projStatus === 2) {
            setProjStatus(3);
            const projYMatrix = [
                // матрица маштабирования
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [1, 0, 1, 0],
                [0, 0, 0, 1],
            ];
            projMatrix = multiply(matrixModel, projYMatrix);
        } else {
            const projZMatrix = [
                // матрица маштабирования
                [1, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 1],
            ];
            projMatrix = multiply(matrixModel, projZMatrix);
            setProjStatus(1);
        }

        setDrawModel((model) => ({ ...model, matrixModel: projMatrix }));
    };

    const onReset = () => {
        setStatus("draw");
        setDrawModel({ matrixModel, edges });
        setActionModel(matrixModel);
    };

    return (
        <>
            <button
                className="buttons-panel-button"
                onClick={() => {
                    setStatus("draw");
                    setDrawModel({ matrixModel, edges });
                    setActionModel(matrixModel, edges);
                    setStatusDraw(true);
                }}
            >
                Отрисовать
            </button>
            {statusDraw ? (
                <button className="buttons-panel-button" onClick={onReset}>
                    Сбросить
                </button>
            ) : null}

            {statusDraw ? (
                <button className="buttons-panel-button" onClick={onProjection}>
                    Ортогональная проекция
                </button>
            ) : null}
        </>
    );
};
