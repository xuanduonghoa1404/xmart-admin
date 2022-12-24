import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { fabric } from "fabric";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Select, Upload } from "antd";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import {
  UndoOutlined,
  RedoOutlined,
  DownloadOutlined,
  CloudUploadOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { Colorpicker, ColorPickerValue } from "antd-colorpicker";
import {
  BsType,
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
} from "react-icons/bs";
import { FiType } from "react-icons/fi";
import { BiMinusFront } from "react-icons/bi";
import { HiCursorClick } from "react-icons/hi";
import { MdCancel, MdDelete } from "react-icons/md";
import {
  FaPaintBrush,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaTimesCircle,
  FaUndo,
  FaRedo,
} from "react-icons/fa";
import { saveAs } from "file-saver";
import "./editorUI.css";
import CanvasMenu from "./CanvasMenu";
import ColorCircle from "./ColorCircle";

const FontFaceObserver = require("fontfaceobserver");

function Design() {
  const cloudName = "hoaduonghx"; // replace with your own cloud name
  const uploadPreset = "anhakazk"; // replace with your own upload preset
  var canvas;

  const [fontFamily, setFontFamily] = useState("today");
  const [labelTextColor, setLabelTextColor] = useState("#000000");
  const [backgroundTextColor, setBackgroundTextColor] = useState("transparent");
  const [brushColor, setBrushColor] = useState("#ffffff");
  const [brushWidth, setBrushWidth] = useState(1);
  const [strokeColor, setStrokeColor] = useState("");
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [showBackgroundFied, setShowBackgroundField] = useState(false);
  const [showStrokeField, setShowStrokeField] = useState(false);
  const [currentMode, setCurrentMode] = useState("image");
  const [activeToolTip, setActiveToolTip] = useState("");
  const [showPenTool, setShowPenTool] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [buttonSaveLoading, setButtonSaveLoading] = useState(false);
  const [textUnderline, setTextUnderline] = useState(false);
  const [textItalic, setTextItalic] = useState(false);
  const [textBold, setTextBold] = useState(false);
  const [isSelectedText, setIsSelectedText] = useState(false);

  const [popoverActive, setPopoverActive] = useState(false);
  const [activeSearchResult, setActiveSearchResult] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedLibLabel, setSelectedLibLabel] = useState(false);

  const [activeUrlImage, setActiveUrlImage] = useState(false);
  const [activeSaveImage, setActiveSaveImage] = useState(false);
  const [labelName, setLabelName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorSaveLabel, setErrorSaveLabel] = useState("");
  const [successSaveMessage, setSuccessSaveMessage] = useState("");
  const [failedSaveMessage, setFailedSaveMessage] = useState("");
  const [breadcrumb, setBreadcrumb] = useState("Make Your Own Label");
  const [statusUndo, setStatusUndo] = useState(false);
  const [statusRedo, setStatusRedo] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);
  const [activeModal, setActiveModal] = useState(false);

  let saveStack = false;
  let editText = false;
  var undo_stack = [];
  var redo_stack = [];
  const tooltips = {
    select: "select",
    text: "text",
    image: "image",
    brush: "brush",
    back: "back",
    front: "front",
    remove: "remove",
    clear: "clear",
  };
  var reader;
  useEffect(() => {
    reader = new FileReader();
    console.log("FileReader", reader);
  }, []);

  const fonts = [
    { label: "Anton-Regular", value: "Anton-Regular" },
    { label: "Archivo-Bold", value: "Archivo-Bold" },
    { label: "Archivo-BoldItalic", value: "archivo_bold_italic" },
    { label: "Archivo-SemiBoldItalic", value: "archivo_semi_bold_italic" },
    { label: "Bangers-Regular", value: "banger_regular" },
    { label: "BarlowCondensed-Bold", value: "barlow_condensed_bold" },
    {
      label: "BarlowCondensed-BoldItalic",
      value: "barlow_condensed_bold_italic",
    },
    { label: "BebasNeue-Regular", value: "beba_regular" },
    { label: "Cairo-Bold", value: "cairo_bold" },
    { label: "CarterOne-Regular", value: "carter_regular" },
    { label: "Chivo-Bold", value: "chivo_bold" },
    { label: "Chivo-BoldItalic", value: "chivo_bold_italic" },
    { label: "Chivo-Italic", value: "chivo_italic" },
    { label: "Chivo-Regular", value: "chivo_regula" },
    { label: "Dynalight-Regular", value: "dynalight_regular" },
    { label: "FugazOne-Regular", value: "fugazone_regular" },
    { label: "Galada-Regular", value: "galada_regular" },
    { label: "GESSTwoBold-Bold", value: "GESSTwoBold-Bold" },
    { label: "GESSTwoLight-Light", value: "GESSTwoLight-Light" },
    { label: "GESSTwoMedium-Medium", value: "GESSTwoMedium-Medium" },
    { label: "Jua-Regular", value: "jua_regular" },
    { label: "Knewave-Regular", value: "knewave_regular" },
    { label: "Lato-Black", value: "lato_black" },
    { label: "Lato-BlackItalic", value: "lato_black_italic" },
    { label: "Lato-Bold", value: "lato_bold" },
    { label: "Lato-BoldItalic", value: "lato_bold_italic" },
    { label: "Montserrat-Bold", value: "montser_bold" },
    { label: "Montserrat-BoldItalic", value: "montser_bold_italic" },
    { label: "Montserrat-ExtraBold", value: "montser_extra_blod" },
    { label: "Montserrat-ExtraBoldItalic", value: "montser_extra_blod_italic" },
    { label: "Montserrat-Medium", value: "montser_medium" },
    { label: "Montserrat-MediumItalic", value: "montser_medium_italic" },
    { label: "Niconne-Regular", value: "niconne_regular" },
    { label: "NotoSans-Bold", value: "notosan_bold" },
    { label: "NotoSans-BoldItalic", value: "notosan_bold_italic" },
    { label: "OpenSans-Bold", value: "opensan_blod" },
    { label: "OpenSans-BoldItalic", value: "opensan_blod_italic" },
    { label: "OpenSans-ExtraBold", value: "opensan_extra_bold" },
    { label: "OpenSans-ExtraBoldItalic", value: "opensan_extra_bold_italic" },
    { label: "Overpass-Bold", value: "overpass_bold" },
    { label: "Overpass-BoldItalic", value: "overpass_bold_italic" },
    { label: "Pattaya-Regular", value: "pattaya_regular" },
    { label: "Patron-Light", value: "Patron-Light" },
    { label: "Patron-Medium", value: "Patron-Medium" },
    { label: "Patron-Regular", value: "Patron-Regular" },
    { label: "Patron-Thin", value: "Patron-Thin" },
    { label: "Podkova-Bold", value: "podkava_bold" },
    { label: "Poppins-Bold", value: "poppins_bold" },
    { label: "Poppins-BoldItalic", value: "poppins_bold_italic" },
    { label: "Poppins-ExtraBold", value: "poppins_extra_bold" },
    { label: "Poppins-ExtraBoldItalic", value: "poppins_extra_bold_italic" },
    { label: "Poppins-MediumItalic", value: "poppins_medium_italic" },
    { label: "Poppins-Regular", value: "poppins_regular" },
    { label: "Poppins-SemiBold", value: "poppins_semi_bold" },
    { label: "Poppins-SemiBoldItalic", value: "poppins_semi_bold_italic" },
    { label: "ProzaLibre-Bold", value: "prozallibre_bold" },
    { label: "ProzaLibre-BoldItalic", value: "prozallibre_bold_italic" },
    { label: "Roboto-Bold", value: "roboto_bold" },
    { label: "Roboto-BoldItalic", value: "roboto_bold_italic" },
    { label: "Rubik-Bold", value: "rubik_bold" },
    { label: "Rubik-BoldItalic", value: "rubik_bold_italic" },
    { label: "Rubik-ExtraBold", value: "rubik_extra_bold" },
    { label: "Rubik-ExtraBoldItalic", value: "rubik_extra_bold_italic" },
    { label: "Rubik-SemiBold", value: "rubik_semi_bold" },
    { label: "Rubik-SemiBoldItalic", value: "rubik_semi_bold_italic" },
    { label: "Staatliches-Regular", value: "staatlic_regular" },
  ];

  const mode = {
    pen: "pen",
    select: "select",
    text: "text",
    image: "image",
    free: "",
  };
  // const [canvas, setCanvas] = useState("");
  // useEffect(() => {
  //   setCanvas(initCanvas());
  // }, []);
  // const initCanvas = () =>
  //   new fabric.Canvas("canvas", {
  //     height: 800,
  //     width: 800,
  //     backgroundColor: "pink",
  //   });
  useEffect(() => {
    let canvasW, canvasH;
    canvasW = 580;
    canvasH = 250;
    // if ($(window).width() < 1225) {
    //   canvasW = 300;
    //   canvasH = 300;
    // }

    const initCanvas = (id) => {
      return new fabric.Canvas(id, {
        width: canvasW,
        height: canvasH,
        selection: false,
        backgroundColor: "transparent",
        preserveObjectStacking: true,
      });
    };
    canvas = initCanvas("canvas");
    undo_stack.push(JSON.stringify(canvas));

    canvas.renderAll();

    reader.addEventListener("load", () => {
      console.log("reader.result", reader.result);
      if (reader.result.includes("svg+xml")) {
        fabric.loadSVGFromURL(reader.result, function (objects, options) {
          var svg = fabric.util.groupSVGElements(objects, options);
          svg.scaleToWidth(200);
          svg.scaleToHeight(200);
          canvas.add(svg);
          canvas.bringToFront(svg);
          canvas.renderAll();
        });
      } else {
        fabric.Image.fromURL(reader.result, (img) => {
          img.scaleToWidth(200);
          img.scaleToHeight(200);
          canvas.add(img);
          canvas.bringToFront(img);
          canvas.renderAll();
        });
      }
    });

    //add img default
    // handleAddImageToCanvasFromUrl(
    //   `https://res.cloudinary.com/hoaduonghx/image/upload/v1670163364/image/Banner6_pi5vpd.png`
    // );
    //add img default
    let text = new fabric.IText("Sale", {
      left: 50,
      top: 85,
      fill: labelTextColor,
    });
    canvas.add(text);
    canvas.setActiveObject(text);

    canvas.on("object:added", function (event) {
      if (saveStack) return;
      setStatusUndo(false);
      undo_stack.push(JSON.stringify(canvas));
      redo_stack.length = 0;
    });
    canvas.on("object:modified", function (event) {
      if (saveStack) return;
      setStatusUndo(false);
      undo_stack.push(JSON.stringify(canvas));
      redo_stack.length = 0;
    });
    canvas.on("mouse:down", function () {
      const activeObj = canvas.getActiveObject();
      if (activeObj && activeObj.get("type").includes("text")) {
        setIsSelectedText(true);
      } else {
        setIsSelectedText(false);
      }
    });
    canvas.on("object:removed", function () {
      setIsSelectedText(false);
    });
    // window.addEventListener("keydown", function (event) {
    //Undo - CTRL+Z
    // if (event.ctrlKey && event.keyCode == 90) {
    //   $("#undo").click();
    // }
    // //Redo - CTRL+Y
    // else if (event.ctrlKey && event.keyCode == 89) {
    //   $("#redo").click();
    // }
    // });

    //handle remove active item
    // window.addEventListener("keyup", function (e) {
    //   if ((e.keyCode == 8) | (e.keyCode == 46)) {
    //     deleteSelectedObjects();
    //   }
    // });
    // document.getElementById("undo").addEventListener("click", undo);
    // document.getElementById("redo").addEventListener("click", redo);
  }, []);
  const [files, setFiles] = useState([]);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [errorMessageValidate, setErrorMessageValidate] = useState("");
  const hasError = rejectedFiles.length > 0;

  // undo, redo editor page
  const undo = useCallback(() => {
    if (undo_stack.length > 0) {
      saveStack = true;
      if (undo_stack.length > 1) {
        setStatusUndo(false);
        if (canvas.getObjects().length > 0) {
          redo_stack.push(undo_stack.pop());
        }
      }
      if (redo_stack.length > 0) setStatusRedo(false);
      const content = undo_stack[undo_stack.length - 1];
      canvas.loadFromJSON(content, function () {
        canvas.renderAll();
        saveStack = false;
      });
    }
    if (undo_stack.length == 1) setStatusUndo(true);
  }, []);
  const redo = useCallback(() => {
    if (redo_stack.length > 0) {
      setStatusRedo(false);
      saveStack = true;
      const content = redo_stack.pop();
      undo_stack.push(content);
      if (undo_stack.length > 1) setStatusUndo(false);
      canvas.loadFromJSON(content, function () {
        canvas.renderAll();
        saveStack = false;
      });
    }
    if (redo_stack.length == 0) setStatusRedo(true);
  }, []);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const loadAndUse = useCallback((font) => {
    var myFont = new FontFaceObserver(font);
    myFont
      .load()
      .then(function () {
        // when font is loaded, use it.
        canvas.getActiveObject().set("fontFamily", font);
        canvas.requestRenderAll();
      })
      .catch(function (e) {
        console.log(e);
      });
  }, []);
  const handleAddText = useCallback((value) => {
    var text = new fabric.IText("Tap and Type", {
      left: 50,
      top: 100,
      fill: labelTextColor,
    });
    loadAndUse(value);
    canvas.add(text);
    canvas.setActiveObject(text);
    setIsSelectedText(true);
    setIsDirty(true);
  }, []);

  const handleFontFamilyChange = useCallback((value) => {
    setFontFamily(value);
    if (canvas.getActiveObject()) {
      if (value !== "Times New Roman") {
        loadAndUse(value);
      } else {
        canvas.getActiveObject().set("fontFamily", value);
        canvas.renderAll();
      }
    }
    setIsDirty(true);
  }, []);
  const handleLabelTextColorChange = useCallback((value) => {
    setLabelTextColor(value);
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("fill", value);
      canvas.renderAll();
    }
    setIsDirty(true);
  }, []);
  const handleQuickSelectLabelTextColor = useCallback((value) => {
    setLabelTextColor(value);
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("fill", value);
      canvas.renderAll();
    }
    setIsDirty(true);
  }, []);

  const handleBackgroundTextColorChange = useCallback((value) => {
    setBackgroundTextColor(value);
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("textBackgroundColor", value);
      canvas.renderAll();
    }
    setIsDirty(true);
  }, []);

  const handleQuickSelectBackgroundText = useCallback((value) => {
    setBackgroundTextColor(value);
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("textBackgroundColor", value);
      canvas.renderAll();
    }
    setIsDirty(true);
  }, []);

  const handleStrokeColorChange = useCallback((value) => {
    setStrokeColor(value);
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("stroke", value);
      canvas.renderAll();
    }
    setIsDirty(true);
  }, []);

  const handleQuickSelectStrokeColor = useCallback((value) => {
    setStrokeColor(value);
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("stroke", value);
      canvas.renderAll();
    }
    setIsDirty(true);
  }, []);

  const handleStrokeWidthChange = useCallback((value) => {
    setStrokeWidth(value);
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("strokeWidth", value);
      canvas.renderAll();
    }
    setIsDirty(true);
  }, []);
  const handleToggleBackground = useCallback((e) => {
    if (e.target.checked) {
      setShowBackgroundField(true);
    } else {
      setShowBackgroundField(false);
      handleBackgroundTextColorChange("transparent");
    }
    setIsDirty(true);
  }, []);

  const handleToggleStroke = useCallback((e) => {
    if (e.target.checked) {
      setShowStrokeField(true);
    } else {
      setShowStrokeField(false);
      handleStrokeColorChange("transparent");
      handleStrokeWidthChange(0);
    }
    setIsDirty(true);
  }, []);

  const handleToggleTextUnderline = useCallback(() => {
    setTextUnderline(!textUnderline);
  }, [textUnderline]);

  const handleToggleTextItalic = useCallback(() => {
    setTextItalic(!textItalic);
  }, [textItalic]);

  const handleToggleTextBold = useCallback(() => {
    setTextBold(!textBold);
  }, [textBold]);

  useEffect(() => {
    if (textBold) {
      handleTextBoldChange("bold");
    } else {
      handleTextBoldChange("none");
    }
    if (textItalic) {
      handleTextItalicChange("italic");
    } else {
      handleTextItalicChange("none");
    }
    if (textUnderline) {
      handleTexUnderlineChange("underline");
    } else {
      handleTexUnderlineChange("none");
    }
  }, [textBold, textItalic, textUnderline]);

  const handleTexUnderlineChange = useCallback((style) => {
    let activeEl = canvas.getActiveObject();
    if (activeEl && activeEl.get("type") == "i-text") {
      if (style == "underline") {
        activeEl.setSelectionStyles(
          { underline: true },
          0,
          activeEl.text.length
        );
        canvas.renderAll();
      } else {
        activeEl.setSelectionStyles(
          { underline: false },
          0,
          activeEl.text.length
        );
        canvas.renderAll();
      }
    }
  }, []);

  const handleTextBoldChange = useCallback((style) => {
    let activeEl = canvas.getActiveObject();
    if (activeEl && activeEl.get("type") == "i-text") {
      if (style == "bold") {
        activeEl.set("fontWeight", "bold");
        canvas.renderAll();
      } else {
        activeEl.set("fontWeight", "");
        canvas.renderAll();
      }
    }
    setIsDirty(true);
  }, []);

  const handleTextItalicChange = useCallback((style) => {
    let activeEl = canvas.getActiveObject();
    if (activeEl && activeEl.get("type") == "i-text") {
      if (style == "italic") {
        activeEl.set("fontStyle", "italic");
        canvas.renderAll();
      } else {
        activeEl.set("fontStyle", "normal");
        canvas.renderAll();
      }
    }
    setIsDirty(true);
  }, []);
  const handleShowMenuToolArea = useCallback(
    (value) => {
      handleDeactivateObject();
      if (popoverActive) {
        togglePopoverActive();
      }
      console.log("handleShowMenuToolArea", value);
      if (value == mode.pen) {
        if (currentMode == mode.pen) {
          setCurrentMode(mode.free);
        } else {
          setCurrentMode(mode.pen);
          handleShowPenTool();
        }
      } else if (value == mode.text) {
        deactivateDrawingMode();
        setIsSelectedText(false);
        if (currentMode == mode.text) {
          setCurrentMode(mode.free);
        } else {
          setCurrentMode(mode.text);
        }
      } else if (value == mode.select) {
        deactivateDrawingMode();
        if (currentMode == mode.select) {
          setCurrentMode(mode.free);
        } else {
          setCurrentMode(mode.select);
        }
      } else if (value == mode.image) {
        deactivateDrawingMode();
        if (currentMode == mode.image) {
          setCurrentMode(mode.free);
        } else {
          setCurrentMode(mode.image);
        }
      }
      setIsDirty(true);
    },
    [currentMode, popoverActive]
  );
  const deactivateDrawingMode = useCallback(() => {
    if (canvas.isDrawingMode) {
      canvas.isDrawingMode = false;
      canvas.renderAll();
    }
    handleResetBrush();
    setIsDirty(true);
  }, []);

  const handleDeactivateObject = useCallback(() => {
    let activeEl = canvas.getActiveObject();
    if (activeEl) {
      canvas.discardActiveObject();
      canvas.renderAll();
    }
    setIsDirty(true);
  }, []);

  const handleShowPenTool = useCallback(() => {
    console.log("canvas.isDrawingMode", canvas.isDrawingMode);
    if (!canvas.isDrawingMode) {
      canvas.freeDrawingBrush.width = brushWidth;
      canvas.freeDrawingBrush.color = brushColor;
      setShowPenTool(true);
      canvas.isDrawingMode = true;
      canvas.renderAll();
    }
    setIsDirty(true);
  }, []);

  const handleResetBrush = useCallback((canvas) => {
    setBrushColor("#ffffff");
    setBrushWidth(1);
    setIsDirty(true);
  }, []);

  const handleBringToFront = useCallback(() => {
    setCurrentMode(mode.free);
    let activeEl = canvas.getActiveObject();
    if (activeEl) {
      canvas.bringToFront(activeEl);
      canvas.renderAll();
      if (saveStack) return;
      setStatusUndo(false);
      undo_stack.push(JSON.stringify(canvas));
      redo_stack.length = 0;
    }
    setIsDirty(true);
  }, []);

  const handleSendToBack = useCallback(() => {
    setCurrentMode(mode.free);
    let activeEl = canvas.getActiveObject();
    if (activeEl) {
      canvas.sendToBack(activeEl);
      canvas.renderAll();
      if (saveStack) return;
      setStatusUndo(false);
      undo_stack.push(JSON.stringify(canvas));
      redo_stack.length = 0;
    }
    setIsDirty(true);
  }, []);

  const handleChangeBrushColor = useCallback((value) => {
    setBrushColor(value);
    canvas.freeDrawingBrush.color = value;
    canvas.renderAll();
    setIsDirty(true);
  }, []);

  const handleChangeBrushWidth = useCallback((value) => {
    setBrushWidth(value);
    canvas.freeDrawingBrush.width = value;
    canvas.renderAll();
    setIsDirty(true);
  }, []);

  const handleQuickSelectBrushColor = useCallback((value) => {
    setBrushColor(value);
    canvas.freeDrawingBrush.color = value;
    canvas.renderAll();
    setIsDirty(true);
  }, []);

  const handleRemoveObject = useCallback(() => {
    if (canvas.getActiveObject()) {
      let item = canvas.getActiveObject();
      canvas.remove(item);
      canvas.renderAll();
    }
    setIsDirty(true);
  }, []);

  const handleDrop = useCallback((acceptedFiles) => {
    reader.readAsDataURL(acceptedFiles[0].originFileObj);
    // if (acceptedFiles.length) {
    //   if (acceptedFiles[0].size <= 2 * 1000 * 1000) {
    //     const fileType = acceptedFiles[0].type.toLowerCase();
    //     if (
    //       fileType.includes("/jpeg") ||
    //       fileType.includes("/gif") ||
    //       fileType.includes("/png") ||
    //       fileType.includes("/svg")
    //     ) {
    //       setFiles((files) => [...files, ...acceptedFiles]);
    //       console.log(
    //         "reader.readAsDataURL(acceptedFiles[0]);",
    //         acceptedFiles[0]
    //       );
    //       reader.readAsDataURL(acceptedFiles[0]);
    //     } else {
    //       setRejectedFiles(acceptedFiles);
    //       setErrorMessageValidate(
    //         "The image must be in JPG, PNG, SVG or GIF format. The maximum size is 2MB."
    //       );
    //     }
    //   } else {
    //     setRejectedFiles(acceptedFiles);
    //     setErrorMessageValidate(
    //       "The uploaded image is too large, the max image size is 2MB."
    //     );
    //   }
    // }
  }, []);

  // const handleDrop = useCallback(
  //   (acceptedFiles, rejectedFiles) => {
  //     setErrorMessageValidate("");
  //     setIsDirty(true);
  //     setRejectedFiles([]);
  //     console.log("handleDrop", acceptedFiles, rejectedFiles);
  //     if (rejectedFiles.length > 0) {
  //       setErrorMessageValidate(
  //         "Is not supported. The image must be in JPG, PNG, SVG or GIF format."
  //       );
  //       setRejectedFiles(rejectedFiles);
  //     } else {
  //       if (acceptedFiles.length) {
  //         if (acceptedFiles[0].size <= 2 * 1000 * 1000) {
  //           const fileType = acceptedFiles[0].type.toLowerCase();
  //           if (
  //             fileType.includes("/jpeg") ||
  //             fileType.includes("/gif") ||
  //             fileType.includes("/png") ||
  //             fileType.includes("/svg")
  //           ) {
  //             setFiles((files) => [...files, ...acceptedFiles]);
  //             console.log(
  //               "reader.readAsDataURL(acceptedFiles[0]);",
  //               acceptedFiles[0]
  //             );
  //             reader.readAsDataURL(acceptedFiles[0]);
  //           } else {
  //             setRejectedFiles(acceptedFiles);
  //             setErrorMessageValidate(
  //               "The image must be in JPG, PNG, SVG or GIF format. The maximum size is 2MB."
  //             );
  //           }
  //         } else {
  //           setRejectedFiles(acceptedFiles);
  //           setErrorMessageValidate(
  //             "The uploaded image is too large, the max image size is 2MB."
  //           );
  //         }
  //       }
  //     }
  //   },
  //   []
  // );

  // const fileUpload = !files.length && <DropZone.FileUpload />;

  const handleSaveFile = useCallback((fileName) => {
    try {
      let canvas = document.getElementById("canvas");
      canvas.toBlob(function (blob) {
        saveAs(blob, `${fileName}.png`);
      });
    } catch (e) {
      message("Đã xảy ra lỗi! Vui lòng thử lại");
    }
    setIsDirty(true);
  }, []);

  return (
    <div className="editor-wrapper">
      <div className="image-editor-controls">
        <div className="image-editor-menu">
          <div
            onMouseEnter={() => setActiveToolTip(tooltips.image)}
            onMouseLeave={() => setActiveToolTip(false)}
            onClick={() => handleShowMenuToolArea(mode.image)}
            // className={classNames("image-editor-item", {
            //   active: currentMode == mode.image,
            // })}
          >
            <FileImageOutlined style={{ color: "blue" }} />
          </div>
          <div
            onMouseEnter={() => setActiveToolTip(tooltips.select)}
            onMouseLeave={() => setActiveToolTip(false)}
            onClick={() => handleShowMenuToolArea(mode.select)}
            // className={classNames("image-editor-item", {
            //   active: currentMode == mode.select,
            // })}
          >
            <HiCursorClick />
          </div>
          <div
            onMouseEnter={() => setActiveToolTip(tooltips.text)}
            onMouseLeave={() => setActiveToolTip(false)}
            onClick={() => handleShowMenuToolArea(mode.text)}
            // className={classNames("image-editor-item", {
            //   active: currentMode == mode.text,
            // })}
          >
            <BsType />
          </div>
          <div
            onMouseEnter={() => setActiveToolTip(tooltips.brush)}
            onMouseLeave={() => setActiveToolTip(false)}
            onClick={() => handleShowMenuToolArea(mode.pen)}
            // className={classNames("image-editor-item", {
            //   active: currentMode == mode.pen,
            // })}
          >
            <FaPaintBrush />
          </div>
          <div
            onMouseEnter={() => setActiveToolTip(tooltips.front)}
            onMouseLeave={() => setActiveToolTip(false)}
            onClick={() => handleBringToFront()}
            // className={classNames("image-editor-item")}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path fill="none" d="M0 0H24V24H0z"></path>
                <path d="M11 3c.552 0 1 .448 1 1v2h5c.552 0 1 .448 1 1v5h2c.552 0 1 .448 1 1v7c0 .552-.448 1-1 1h-7c-.552 0-1-.448-1-1v-2H7c-.552 0-1-.448-1-1v-5H4c-.552 0-1-.448-1-1V4c0-.552.448-1 1-1h7zm5 5H8v8h8V8z"></path>
              </g>
            </svg>
          </div>
          <div
            onMouseEnter={() => setActiveToolTip(tooltips.back)}
            onMouseLeave={() => setActiveToolTip(false)}
            onClick={() => handleSendToBack()}
            // className={classNames("image-editor-item")}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path fill="none" d="M0 0H24V24H0z"></path>
                <path d="M14 3c.552 0 1 .448 1 1v5h5c.552 0 1 .448 1 1v10c0 .552-.448 1-1 1H10c-.552 0-1-.448-1-1v-5H4c-.552 0-1-.448-1-1V4c0-.552.448-1 1-1h10zm-1 2H5v8h8V5z"></path>
              </g>
            </svg>
          </div>
          <div
            onMouseEnter={() => setActiveToolTip(tooltips.remove)}
            onMouseLeave={() => setActiveToolTip(false)}
            onClick={() => handleRemoveObject()}
            // className={classNames("image-editor-item")}
          >
            <MdCancel />
          </div>
          <div
            onMouseEnter={() => setActiveToolTip(tooltips.clear)}
            onMouseLeave={() => setActiveToolTip(false)}
            // onClick={() => handleModalClearCanvas()}
            // className={classNames("image-editor-item")}
          >
            <MdDelete />
          </div>
        </div>
        <div
          id="tooltip-arrange"
          // className={classNames("tooltip", {
          //   active: activeToolTip == tooltips.select,
          // })}
          style={{ top: "120px" }}
        >
          <img
            src="/static/adminhtml/images/editor/arrange.png"
            alt="Arrange tool info"
          />
          <p>
            <label>Arrange</label>
            Move, transform objects.
            {/*<small>Keybord shortcut (V)</small>*/}
          </p>
        </div>
        <div
          id="tooltip-add-text"
          // className={classNames("tooltip", {
          //   active: activeToolTip == tooltips.text,
          // })}
          style={{ top: "160px" }}
        >
          <img
            src="/static/adminhtml/images/editor/text.png"
            alt="Add text tool info"
          />
          <p>
            <label>Text</label>
            Add new text layer or use one of our text styling.
            {/*<small>Keybord shortcut (T)</small>*/}
          </p>
        </div>
        <div
          id="tooltip-add-image"
          // className={classNames("tooltip", {
          //   active: activeToolTip == tooltips.image,
          // })}
          style={{ top: "200px" }}
        >
          <img
            src="/static/adminhtml/images/editor/add-image.png"
            alt="Add image tool info"
          />
          <p>
            <label>Add Image</label>
            Upload or search for images to add to your project.
            {/*<small>Keybord shortcut (I)</small>*/}
          </p>
        </div>
        <div
          id="tooltip-paint"
          // className={classNames("tooltip", {
          //   active: activeToolTip == tooltips.brush,
          // })}
          style={{ top: "240px" }}
        >
          <img
            src="/static/adminhtml/images/editor/drawing.png"
            alt="Paint tool info"
          />
          <p>
            <label>Drawing</label>
            Draw and doodle with lines as well as brushes and colors.
            {/*<small>Keybord shortcut (B)</small>*/}
          </p>
        </div>
        <div
          id="tooltip-front"
          // className={classNames("tooltip", {
          //   active: activeToolTip == tooltips.front,
          // })}
          style={{ top: "320px" }}
        >
          <img
            src="/static/adminhtml/images/editor/bring-to-front.png"
            alt="Bring to front tool info"
          />
          <p>
            <label>Bring To Front</label>
            Bring selected object to front
            {/*<small>Keybord shortcut (key up)</small>*/}
          </p>
        </div>
        <div
          id="tooltip-back"
          // className={classNames("tooltip", {
          //   active: activeToolTip == tooltips.back,
          // })}
          style={{ top: "360px" }}
        >
          <img
            src="/static/adminhtml/images/editor/send-to-back.png"
            alt="Send to back tool info"
          />
          <p>
            <label>Send To Back</label>
            Send selected object to back
            {/*<small>Keybord shortcut (key down)</small>*/}
          </p>
        </div>
        <div
          id="tooltip-remove"
          // className={classNames("tooltip", {
          //   active: activeToolTip == tooltips.remove,
          // })}
          style={{ top: "400px" }}
        >
          <img
            src="/static/adminhtml/images/editor/clear-active.png"
            alt="Remove active object"
          />
          <p>
            <label>Remove Active Object</label>
            Remove selected object
            {/*<small>Keybord shortcut (Delete)</small>*/}
          </p>
        </div>
        <div
          id="tooltip-clear"
          // className={classNames("tooltip", {
          //   active: activeToolTip == tooltips.clear,
          // })}
          style={{ top: "440px" }}
        >
          <img
            src="/static/adminhtml/images/editor/clear-all.png"
            alt="Clear all object"
          />
          <p>
            <label>Clear All</label>
            Clear all object.
          </p>
        </div>
        {/* <Modal
          open={activeModal}
          onClose={handleModalClearCanvas}
          title="Clear all objects"
          primaryAction={{
            content: "Clear all",
            onAction: handleClearCanvas,
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: handleModalClearCanvas,
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <p>Are you sure to clear all objects?</p>
            </TextContainer>
          </Modal.Section>
        </Modal> */}
      </div>
      <div className="image-editor-main">
        {currentMode == mode.text && (
          <div className="text-edit-area">
            <Button onClick={() => handleAddText(fontFamily)}>
              Add new text
            </Button>
            {isSelectedText ? (
              <>
                <div className="editor-title">Font Family</div>
                <Select
                  options={fonts}
                  onChange={handleFontFamilyChange}
                  value={fontFamily}
                />
                <div className="editor-title">Text style</div>
                <div className="editor-text-style">
                  <span
                    onClick={handleToggleTextUnderline}
                    className="text-style"
                  >
                    <BsTypeUnderline style={{ fontSize: "18px" }} />
                  </span>
                  <span onClick={handleToggleTextItalic} className="text-style">
                    <BsTypeItalic style={{ fontSize: "18px" }} />
                  </span>
                  <span onClick={handleToggleTextBold} className="text-style">
                    <BsTypeBold style={{ fontSize: "18px" }} />
                  </span>
                </div>
                <div className="editor-title">Text color</div>
                <div className="text-color">
                  <Colorpicker
                    popup
                    blockStyles={{
                      height: "25px",
                    }}
                  />
                  <span
                    onClick={() => handleQuickSelectLabelTextColor("#375e97")}
                  >
                    <ColorCircle color={"#375e97"} />
                  </span>
                  <span
                    onClick={() => handleQuickSelectLabelTextColor("#fb6542")}
                  >
                    <ColorCircle color={"#fb6542"} />
                  </span>
                  <span
                    onClick={() => handleQuickSelectLabelTextColor("#ffbb00")}
                  >
                    <ColorCircle color={"#ffbb00"} />
                  </span>
                  <span
                    onClick={() => handleQuickSelectLabelTextColor("#f18d9e")}
                  >
                    <ColorCircle color={"#f18d9e"} />
                  </span>
                  <span
                    onClick={() => handleQuickSelectLabelTextColor("#3681ce")}
                  >
                    <ColorCircle color={"#3681ce"} />
                  </span>
                </div>
                <div className="toggle-menu-item">
                  <div className="font-w-7">Background</div>
                  <label className="switch">
                    <input onClick={handleToggleBackground} type="checkbox" />
                    <span className="slider round" />
                  </label>
                </div>
                {showBackgroundFied && (
                  <div>
                    <div className="editor-title">Color</div>
                  </div>
                )}
                <div className="toggle-menu-item">
                  <div className="font-w-7">Stroke</div>
                  <label className="switch">
                    <input onClick={handleToggleStroke} type="checkbox" />
                    <span className="slider round" />
                  </label>
                </div>

                {showStrokeField && (
                  <div>
                    <div className="editor-title">Color</div>

                    <div className="editor-title">Stroke Width</div>
                  </div>
                )}
              </>
            ) : (
              <p>Or choose a text object to edit</p>
            )}
          </div>
        )}
        {currentMode == mode.pen && (
          <div className="text-edit-area">
            <div className="editor-title">Color</div>
          </div>
        )}
        {currentMode == mode.image && (
          <div>
            <div id="add-image-category-list" className="section-list">
              <div
                // onClick={() => setOpenFileDialog(true)}
                data="browse"
                id="add-image-browse"
              >
                <Upload
                  accept={"image/*"}
                  // onDrop={() => {
                  //   handleDrop();
                  // }}
                  onChange={(info) => {
                    if (info.file.status !== "uploading") {
                      console.log(info.file, info.fileList);
                      let fileList = info.fileList;
                      handleDrop(fileList);
                    }
                    if (info.file.status === "done") {
                      message.success(
                        `${info.file.name} file uploaded successfully`
                      );
                    } else if (info.file.status === "error") {
                      message.error(`${info.file.name} file upload failed.`);
                    }
                  }}
                  beforeUpload={(file) => {
                    setFiles([file]);
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload Your Image</Button>
                </Upload>
                {/* <DropZone
                  onFileDialogClose={() => setOpenFileDialog(false)}
                  openFileDialog={openFileDialog}
                  allowMultiple={false}
                  accept="image/*"
                  type="image"
                >
                  {fileUpload}
                </DropZone> */}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="main-canvas-container">
        <div className="main-canvas-area">
          <div className="main-button-canvas">
            <Button onClick={undo} disabled={statusUndo}>
              Undo <UndoOutlined />
            </Button>
            <Button onClick={redo} disabled={statusRedo}>
              <RedoOutlined /> Redo
            </Button>
          </div>
          <canvas id="canvas"></canvas>
        </div>
        <CanvasMenu
          contextMenu={contextMenu}
          clear={() => setContextMenu(null)}
          uploadImage={async () => {
            // setOpenFileDialog(true);
            if (currentMode !== mode.image) handleShowMenuToolArea(mode.image);
          }}
          selectImage={togglePopoverActive}
          addText={() => {
            handleShowMenuToolArea(mode.text);
            handleAddText(fontFamily);
          }}
          undo={undo}
          redo={redo}
          statusUndo={statusUndo}
          statusRedo={statusRedo}
          sendToBack={handleSendToBack}
          sendToFront={handleBringToFront}
          // remove={deleteSelectedObjects}
        />
      </div>
      <div className="action-canvas">
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => {
            handleSaveFile("Image Marketing XMart");
          }}
        >
          Tải về máy
        </Button>
        <Button type="primary" icon={<CloudUploadOutlined />}>
          Lưu trữ trên Cloud
        </Button>
      </div>
    </div>
  );
}

Design.propTypes = {};

export default Design;
