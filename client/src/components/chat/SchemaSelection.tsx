import { type FC, useCallback, useEffect, useRef, useState } from "react";

const SchemaSelection: FC = () => {
    const [selectionVisible, setSelectionVisible] = useState(false);
    const selectionPopUp = useRef<HTMLDivElement>(null);

    const showSelection = useCallback(() => setSelectionVisible(true), []);
    const hideSelection = useCallback(() => setSelectionVisible(false), []);

    useEffect(() => {
        if (selectionPopUp.current && selectionVisible) selectionPopUp.current.focus();
    }, [selectionPopUp, selectionVisible]);

    return (
        <div>
            <button className={"schema-button"} onClick={showSelection} disabled={selectionVisible}>
                +
            </button>
            {selectionVisible && (
                <div ref={selectionPopUp} className={"schema-pop-up"} tabIndex={0} onBlur={hideSelection}>
                    <p>This is the same test pop up</p>
                </div>
            )}
        </div>
    );
};

export default SchemaSelection;
