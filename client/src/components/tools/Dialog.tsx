import { type FC, type PropsWithChildren, useEffect, useRef } from "react";

type DialogProps = {
    title: string;
    visible?: boolean;
    onClose: () => void;
    dismissible?: boolean;
    noHeader?: boolean;
};

const Dialog: FC<PropsWithChildren<DialogProps>> = ({ title, children, onClose, dismissible, visible, noHeader }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const dialogContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (visible) {
            dialog.showModal();
            if (dialogContainerRef.current) dialogContainerRef.current.focus();
        } else {
            dialog.close();
        }
    }, [dialogRef, visible, onClose, dialogContainerRef]);

    return (
        visible && (
            <dialog className="dialog-overlay" ref={dialogRef}>
                <div className="dialog-container" ref={dialogContainerRef} onBlur={dismissible ? onClose : undefined}>
                    {!noHeader && (
                        <div className="dialog-header">
                            <h2>{title}</h2>
                            <button className="close-button" onClick={onClose}>
                                &times;
                            </button>
                        </div>
                    )}
                    <div className="dialog-content">{children}</div>
                </div>
            </dialog>
        )
    );
};

export default Dialog;
