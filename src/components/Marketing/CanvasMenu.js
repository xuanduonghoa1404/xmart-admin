import { useEffect, useCallback } from "react";

export default function CanvasMenu(props) {
  const { contextMenu, clear } = props;

  const handleClick = useCallback(() => {
    clear();
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  if (!contextMenu) return <></>;

  const { top, left, isObject } = contextMenu;

  if (isObject) {
    const { sendToBack, sendToFront, remove } = props;
    return (
      <div id="canvas-context-menu" style={{ top, left }}>
        <section onClick={sendToFront}>Bring to Front</section>
        <section onClick={sendToBack}>Send to Back</section>
        <section onClick={remove}>Remove</section>
      </div>
    );
  } else {
    const {
      uploadImage,
      selectImage,
      addText,
      statusUndo,
      statusRedo,
      undo,
      redo,
    } = props;

    return (
      <div id="canvas-context-menu" style={{ top, left }}>
        <section onClick={uploadImage}>Upload Image</section>
        <section onClick={selectImage}>Select Image</section>
        <section onClick={addText}>Add Text</section>
        <div></div>
        <section
          className={statusUndo ? "canvas-context-menu-disabled" : undefined}
          onClick={() => {
            if (statusUndo) return;
            undo();
          }}
        >
          Undo
        </section>
        <section
          className={statusRedo ? "canvas-context-menu-disabled" : undefined}
          onClick={() => {
            if (statusRedo) return;
            redo();
          }}
        >
          Redo
        </section>
      </div>
    );
  }
}
