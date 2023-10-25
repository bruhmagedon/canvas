import { useState, createContext } from "react";

import { Canvas } from "../service/graphic-service";
import { ModelMove } from "../action/move.";
import { ModelRotate } from "../action/rotate";
import { ModelDraw } from "../action/draw";
import { ModelScale } from "../action/scale";

import "../styles/app.scss";

export const ModelContext = createContext("");

const App = () => {
    const [status, setStatus] = useState(null);

    // * модель для отрисовки
    const [drawModel, setDrawModel] = useState({
        matrixModel: null,
        edges: null,
    });

    //* модель для синхронизации
    const [actionModel, setActionModel] = useState(null);

    const [statusDraw, setStatusDraw] = useState(false);

    return (
        <div className="container">
            <aside className="buttons-panel">
                <nav className="buttons-panel-navigate">
                    <ModelContext.Provider
                        value={{
                            status,
                            setStatus,
                            drawModel,
                            setDrawModel,
                            actionModel,
                            setActionModel,
                        }}
                    >
                        {statusDraw ? <ModelRotate /> : null}
                        {statusDraw ? <ModelMove /> : null}
                    </ModelContext.Provider>
                </nav>
            </aside>

            {/* вот тута мне нужно достать нужный стейт, его передать в экшен компоненты */}
            <ModelContext.Provider value={{ drawModel }}>
                <Canvas />
            </ModelContext.Provider>

            <aside className="buttons-panel">
                <nav className="buttons-panel-navigate">
                    {/* сюда он передается для дальнейшего взаимодействия */}
                    <ModelContext.Provider
                        value={{
                            status,
                            setStatus,
                            drawModel,
                            setDrawModel,
                            actionModel,
                            setActionModel,
                        }}
                    >
                        <ModelDraw statusDraw={{ setStatusDraw, statusDraw }} />
                        {statusDraw ? <ModelScale /> : null}
                    </ModelContext.Provider>
                </nav>
            </aside>
        </div>
    );
};

export default App;
