import { saveAs } from "file-saver";
import React, { useCallback, useRef } from "react";
import { stylesheet } from "typestyle";
import { useListContext } from "../contexts/List";
import { useWindowEventListener } from "../hooks/event";
import { COLORS } from "../styles/palette";

const styles = stylesheet({
  root: {
    backgroundColor: COLORS.aubergineDark,
    color: COLORS.greyWarm,
    display: "flex",
    flexDirection: "row",
    padding: "5px",
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
  },
  logo: {
    color: COLORS.pinkBright,
  },
  btn: {
    backgroundColor: "inherit",
    border: "none",
    color: COLORS.greyWarm,
    fontFamily: "inherit",
    fontSize: "inherit",
    marginLeft: "10px",
    $nest: {
      "&:active, &:focus, &:hover": {
        backgroundColor: "black",
        borderRadius: "1px",
        color: "#bbbbbb",
      },
    },
  },
});

export const Menu: React.FC = () => {
  const { format, formatted, setFormat, shuffleItems } = useListContext();
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  let downloadSupported: boolean | undefined;
  try {
    downloadSupported = !!new Blob();
  } catch (e) {
    console.info("File download is not supported", e);
  }

  const handleReformat = useCallback(() => {
    if (format === "json") {
      setFormat("text");
    } else {
      setFormat("json");
    }
  }, [format, setFormat]);

  const handleSlash = useCallback((ev: KeyboardEvent) => {
    if (ev.key === "/" && !ev.altKey && !ev.ctrlKey && firstBtnRef.current) {
      if (document.activeElement === firstBtnRef.current) {
        firstBtnRef.current.blur();
      } else {
        firstBtnRef.current.focus();
      }
    }
  }, []);

  const handleCopy = useCallback(() => {
    const textField = document.createElement("textarea");
    textField.innerHTML = formatted;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    window.alert("Copied!");
  }, [formatted]);

  const handleDownload = useCallback(() => {
    const type = format === "json" ? "application/json" : "text/plain";
    const blob = new Blob([formatted], { type: `${type};charset=utf-8` });
    saveAs(blob, format === "json" ? "qshuf.json" : "qshuf.txt");
  }, [format, formatted]);

  useWindowEventListener("keydown", handleSlash);

  return (
    <div className={styles.root}>
      <span className={styles.logo}>QShuf</span>
      <button className={styles.btn} onClick={shuffleItems} ref={firstBtnRef}>
        Shuffle
      </button>
      <button className={styles.btn} onClick={handleReformat}>
        {`Format: ${format}`}
      </button>
      {document.queryCommandSupported("copy") && (
        <button className={styles.btn} onClick={handleCopy}>
          {`Copy ${format === "json" ? "JSON" : "Text"}`}
        </button>
      )}
      {downloadSupported && (
        <button className={styles.btn} onClick={handleDownload}>
          Download
        </button>
      )}
    </div>
  );
};
