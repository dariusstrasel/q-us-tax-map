import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Controls = ({ onCsvUpload, onRandomize }) => (_jsxs("div", { className: "controls", children: [_jsx("input", { type: "file", accept: ".csv", onChange: e => {
                if (e.target.files && e.target.files[0])
                    onCsvUpload(e.target.files[0]);
            } }), _jsx("button", { onClick: onRandomize, children: "Random Scenario" })] }));
