import { fabric } from "fabric";
import { useEffect, useCallback, useState, useContext } from "react";
import classNames from "classnames";
import cookies from "next-cookies";
import {
  Select,
  TextField,
  TextContainer,
  Button,
  RangeSlider,
  Icon,
  Stack,
  Card,
  Tabs,
  ResourceItem,
  Link,
  Avatar,
  ResourceList,
  Thumbnail,
  TextStyle,
  Modal,
  Banner,
  List,
  DropZone,
  InlineError,
  ContextualSaveBar,
  ButtonGroup,
} from "@shopify/polaris";
import {
  TypeMajor,
  SlideshowMajor,
  PaintBrushMajor,
  BehaviorMajor,
  CircleChevronUpMinor,
  CircleChevronDownMinor,
  DeleteMajor,
  CircleCancelMajor,
  SearchMinor,
  MobileCancelMajor,
  UndoMajor,
  RedoMajor,
} from "@shopify/polaris-icons";

import ColorCircle from "components/editorUI/colorCircle";
import CanvasMenu from "components/editorUI/canvasMenu";
import { saveAs } from "file-saver";
import { writeLog } from "../helper/logger";

const FontFaceObserver = require("fontfaceobserver");
import { useRouter } from "next/router";

export default function Editor({
  shopId,
  labelTemplatesData,
  customerLabelsData,
  currentPlan,
  shop,
}) {
  const Router = useRouter();
  const labelLibsData = labelTemplatesData;
  const baseUrl = SERVER_URL;
  var canvas;

  const [fontFamily, setFontFamily] = useState("today");
  const [labelTextColor, setLabelTextColor] = useState("#ffffff");
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
  });

  /* eslint-disable */
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
  /* eslint-enable */

  const mode = {
    pen: "pen",
    select: "select",
    text: "text",
    image: "image",
    free: "",
  };

  useEffect(() => {
    let canvasW, canvasH;
    canvasW = 400;
    canvasH = 400;
    if ($(window).width() < 1225) {
      canvasW = 300;
      canvasH = 300;
    }

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
    handleAddImageToCanvasFromUrl(
      `https://${baseUrl}/static/adminhtml/template_libs/14/113.png`
    );
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
    window.addEventListener("keydown", function (event) {
      //Undo - CTRL+Z
      if (event.ctrlKey && event.keyCode == 90) {
        $("#undo").click();
      }
      //Redo - CTRL+Y
      else if (event.ctrlKey && event.keyCode == 89) {
        $("#redo").click();
      }
    });

    //handle remove active item
    window.addEventListener("keyup", function (e) {
      if ((e.keyCode == 8) | (e.keyCode == 46)) {
        deleteSelectedObjects();
      }
    });
    document.getElementById("undo").addEventListener("click", undo);
    document.getElementById("redo").addEventListener("click", redo);
  }, []);
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
  const deleteSelectedObjects = useCallback(() => {
    let obj = canvas.getActiveObject();
    if (obj && !obj.isEditing) {
      canvas.getActiveObjects().forEach((element) => {
        canvas.remove(element);
      });
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
    undo_stack.push(JSON.stringify(canvas));
    saveStack = false;
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
        writeLog("load font failed", shop, "", "fail", "loadAndUse", font);
      });
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

  const handleSaveFile = useCallback((fileName) => {
    try {
      let canvas = document.getElementById("canvas");
      canvas.toBlob(function (blob) {
        saveAs(blob, `${fileName}.png`);
      });
    } catch (e) {
      writeLog(
        "can't save file",
        shop,
        "",
        "fail",
        "handleSaveFile",
        e.message
      );
      setFailedSaveMessage("Something went wrong, please try again later!");
    }
    setIsDirty(true);
  }, []);

  const handleSaveToMyLabelLib = useCallback((fileName) => {
    try {
      let canvas = document.getElementById("canvas");
      canvas.toBlob(function (blob) {
        let lib_id = "customer";
        fileName = formatLabelName(fileName);
        let affix = Date.now();
        let path = `${fileName}_${affix}.png`;
        let file = new File([blob], `${path}`, {
          type: "image/png",
        });
        handleSendDataToServe(file);
      });

      //    out file data
      //     handleSendDataToServe(file);
    } catch (e) {
      writeLog(
        "can't save to label lib",
        shop,
        "",
        "fail",
        "handleSaveToMyLabelLib",
        e.message
      );
      setFailedSaveMessage("Something went wrong, please try again later!");
    }
    setIsDirty(true);
  }, []);

  const formatLabelName = useCallback((str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
  });

  const uploadFile = async (imgData) => {
    let formData = new FormData();
    let json = {};
    formData.append("filetoupload", imgData);
    let response = await fetch(
      `${API_URL}/uploadCustomerImage?shopId=${shopId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      }
    );
    json = await response.json();
    return json;
    setIsDirty(true);
  };

  const handleSendDataToServe = useCallback((fileData) => {
    uploadFile(fileData).then((res) => {
      if (res.success == true) {
        const fileExist = customerLabelsData.filter((item) => {
          return item.public_url.split("/").pop() == fileData.name;
        });
        if (fileExist.length == 0) {
          updateDB(fileData.name, res.fileName, res.public_url);
        }
      }
    });
    setIsDirty(true);
  }, []);

  const updateDB = async (name, path, public_url) => {
    let createCustomerLabelDB = await fetch(`${API_URL}/createCustomerLabel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain: shop,
        name: name,
        path: path,
        public_url: public_url,
      }),
    });
    let updateDBRes = await createCustomerLabelDB.json();

    if (updateDBRes.success) {
      // if update success then add new item to customer label data
      let newLabel = updateDBRes.item;
      setSuccessSaveMessage(
        "Successfully created label. You can now add this labels to your product by: Home -> Add new label/badge -> Configuration -> Select Labels -> My Labels"
      );
    } else {
      writeLog(
        "can't create customer label",
        shop,
        "",
        "fail",
        "updateDB",
        updateDBRes.message
      );
      setFailedSaveMessage("Something went wrong, please try again later!");
    }
  };

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
          console.log("setCurrentMode mode.pen", mode.pen);
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

  var _clipboard;
  const handleCopyObject = useCallback(() => {
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().clone(function (cloned) {
        _clipboard = cloned;
      });
    }
    setIsDirty(true);
  }, []);

  const handlePasteObject = useCallback(() => {
    if (canvas.getActiveObject()) {
      _clipboard.clone(function (clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
          left: clonedObj.left + 10,
          top: clonedObj.top + 10,
          evented: true,
        });
        if (clonedObj.type === "activeSelection") {
          // active selection needs a reference to the canvas.
          clonedObj.canvas = canvas;
          clonedObj.forEachObject(function (obj) {
            canvas.add(obj);
          });
          // this should solve the un-selectability
          clonedObj.setCoords();
        } else {
          canvas.add(clonedObj);
        }
        _clipboard.top += 10;
        _clipboard.left += 10;
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      });
    }
    setIsDirty(true);
  }, []);

  const handleClearCanvas = useCallback(() => {
    canvas.getObjects().forEach((obj) => {
      canvas.remove(obj);
    });
    setStatusUndo(false);
    setStatusRedo(true);
    setIsDirty(true);
    handleModalClearCanvas();
  }, []);

  const handleModalClearCanvas = useCallback(() => {
    setActiveModal((active) => !active);
  });

  const handleRemoveObject = useCallback(() => {
    if (canvas.getActiveObject()) {
      let item = canvas.getActiveObject();
      canvas.remove(item);
      canvas.renderAll();
    }
    setIsDirty(true);
  }, []);

  // LABEL TEMPLATE POPUP

  //Handle labels lib popover
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const libsPopoverActivator = (
    <Button primary onClick={togglePopoverActive} disclosure>
      Select Label
    </Button>
  );

  const [selectedLib, setSelectedLib] = useState(0);

  const handleLibTabChange = useCallback((selectedLibTabIndex) => {
    setSelectedLib(selectedLibTabIndex);
    setIsDirty(true);
  }, []);

  const handleSelectedLabel = useCallback((item) => {
    const { id, name, path, lib_id } = item;
    let urlImage = `https://${baseUrl}/static/adminhtml/template_libs/${lib_id}/${path}`;
    handleAddImageToCanvasFromUrl(urlImage);
    setIsDirty(true);
  });
  const handleSelectedCustomLabel = useCallback((item) => {
    const { id, name, path, lib_id, public_url } = item;
    let urlImage;
    if (public_url.length) {
      urlImage = public_url + `?timestamp=${new Date().getTime()}`;
    } else {
      urlImage = `https://${baseUrl}/images/customer/${item.domain_id}/${path}`;
    }
    if (!public_url.includes(".svg")) {
      handleAddImageToCanvasFromUrl(urlImage);
    } else {
      handleAddImageSVGToCanvasFromUrl(urlImage);
    }
    setIsDirty(true);
  });
  const labelLibsTabs = labelLibsData
    .filter((lib) => lib.label_templates.length)
    .map((lib) => {
      let locked =
        (currentPlan == "free" && lib.id != 13) ||
        (currentPlan == "five_usd" && lib.id > 19);
      return {
        id: lib.id,
        content: lib.name,
        title: lib.name,
        panelID: lib.name + "-" + lib.id + "-" + lib.plan_id,
        label_templates: lib.label_templates,
        locked: locked,
      };
    });
  const [customerLabels, setCustomerLabels] = useState(customerLabelsData);

  // Declare Customer Label Lib
  const customerLabelLib = {
    id: 10,
    content: "My Labels",
    label_templates: customerLabels,
    locked: false,
    panelID: "My Label",
    title: "My Labels",
  };
  labelLibsTabs.unshift(customerLabelLib);
  // Start search label function
  // get all label name
  var labelTemplateName = [];
  var allLabel = [];
  for (let i = 0; i < labelLibsTabs.length; i++) {
    for (let j = 0; j < labelLibsTabs[i].label_templates.length; j++) {
      labelTemplateName.push(labelLibsTabs[i].label_templates[j]);
      allLabel.push({
        item: labelLibsTabs[i].label_templates[j],
        libIndex: i,
      });
    }
  }
  const handleClickSearchLockedLabel = useCallback((selected) => {
    setActiveSearchResult(false);
    let tabIndex = selected.libIndex;
    let item = selected.item;
    //select on tab
    handleLibTabChange(tabIndex);
    //scroll to view that label
    setTimeout(function () {
      document
        .getElementById(item.id)
        .scrollIntoView({ inline: "center", behavior: "smooth" });
    }, 500);
  }, []);

  const handleClickSearchLabel = useCallback((selected) => {
    setActiveSearchResult(false);
    let tabIndex = selected.libIndex;
    let item = selected.item;
    let libId = item.lib_id;
    //select on tab
    handleLibTabChange(tabIndex);
    //scroll to view that label
    setTimeout(function () {
      document
        .getElementById(item.id)
        .scrollIntoView({ inline: "center", behavior: "smooth" });
    }, 500);
    //select on item
    handleSelectedLabel(item);
  }, []);

  // Resource List
  const resourceName = {
    singular: "label template",
    plural: "label templates",
  };
  const items = [];

  function renderItem(item) {
    let selected = item;
    item = item.item;
    const { id, name, path, lib_id, public_url } = item;
    let isLocked =
      (currentPlan == "free" && lib_id != 13) ||
      (currentPlan == "five_usd" && lib_id > 19);
    let content = "";
    let media = "";
    if (lib_id) {
      media = (
        <Thumbnail
          source={`/static/adminhtml/template_libs/${lib_id}/${path}`}
          alt="title"
        />
      );
    } else {
      media = (
        <Thumbnail
          source={
            public_url.length
              ? public_url
              : `/images/customer/${data.domain_id}/${path}`
          }
          alt="title"
        />
      );
    }

    if (!isLocked) {
      content = (
        <ResourceItem
          id={id}
          media={media}
          accessibilityLabel={`View details for ${name}`}
          onClick={() => handleClickSearchLabel(selected)}
        >
          <div>
            <TextStyle variation="strong">{name}</TextStyle>
          </div>
        </ResourceItem>
      );
    } else {
      content = (
        <ResourceItem
          id={id}
          media={media}
          accessibilityLabel={`View details for ${name}`}
          onClick={() => handleClickSearchLockedLabel(selected)}
        >
          <div>
            <TextStyle variation="strong">{name}</TextStyle>
          </div>
        </ResourceItem>
      );
    }
    return content;
  }

  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [labelList, setLabelList] = useState([]);

  const handleSearchTextChange = useCallback(
    async (value) => {
      setSearchText(value);
      if (value === "") {
        setLabelList([]);
        setActiveSearchResult(false);
        return;
      }

      if (value.length >= 2) {
        setLoading(true);
        let newLabelList = [];
        allLabel.map((label) => {
          let title = label.item.name.toLowerCase();
          let searchLowerCase = value ? value.toLowerCase() : "";
          if (title.includes(searchLowerCase)) {
            newLabelList.push(label);
          }
        });
        if (newLabelList.length >= 1) {
          setLabelList(newLabelList);
          setActiveSearchResult(true);
        }
        setLoading(false);
      } else if (!value || value.length === 0) {
        setLabelList([]);
      }
    },
    [labelList]
  );

  const toggleModalUrlImage = useCallback(() => {
    setActiveUrlImage((activeUrlImage) => !activeUrlImage);
    setImageUrl("");
    if (popoverActive) {
      togglePopoverActive();
    }
  }, [popoverActive]);

  const handleOpenImageFromUrl = useCallback(() => {
    handleAddImageToCanvasFromUrl(imageUrl);
    toggleModalUrlImage();
  }, [imageUrl]);

  const handleAddImageToCanvasFromUrl = useCallback((dataImg) => {
    fabric.Image.fromURL(
      dataImg,
      (img) => {
        img.scaleToWidth(200);
        img.scaleToHeight(200);
        canvas.add(img);
        canvas.bringToFront(img);
        canvas.renderAll();
      },
      { crossOrigin: "Anonymous" }
    );
  }, []);

  const handleAddImageSVGToCanvasFromUrl = useCallback((dataImg) => {
    fabric.loadSVGFromURL(
      dataImg,
      function (objects, options) {
        var svg = fabric.util.groupSVGElements(objects, options);
        svg.scaleToWidth(200);
        svg.scaleToHeight(200);
        canvas.add(svg);
        canvas.bringToFront(svg);
        canvas.renderAll();
      },
      null,
      { crossOrigin: "Anonymous" }
    );
  }, []);

  const handleImageUrlChange = useCallback((value) => {
    setImageUrl(value);
  }, []);

  const handleDeleteCustomLabel = async (item) => {
    let deleteCustomerLabelDB = await fetch(`${API_URL}/deleteCustomerLabel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain: shop,
        id: item.id,
      }),
    });
    let deleteDBRes = await deleteCustomerLabelDB.json();

    if (deleteDBRes.success) {
      removeCustomerLabelItem(item);
    } else {
      writeLog(
        "can't delete customer label",
        shop,
        "",
        "fail",
        "handleDeleteCustomLabel",
        deleteDBRes.message
      );
    }
  };
  const removeCustomerLabelItem = useCallback((item) => {
    let elementId = item.id;
    let elementIndex = customerLabels.indexOf(item);
    customerLabels.splice(elementIndex, 1);
    let querySelector = ".bss-customer-label-" + elementId;
    let deletedItem = $(querySelector);
    deletedItem.remove();
  }, []);
  const [files, setFiles] = useState([]);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [errorMessageValidate, setErrorMessageValidate] = useState("");
  const hasError = rejectedFiles.length > 0;
  const errorMessage = hasError && (
    <div style={{ marginBottom: "6px" }}>
      <Banner status="critical">
        <List type="bullet">
          {rejectedFiles.map((file, index) => (
            <List.Item key={index}>{`${errorMessageValidate}`}</List.Item>
          ))}
        </List>
      </Banner>
    </div>
  );

  const handleDrop = useCallback(
    (_droppedFiles, acceptedFiles, rejectedFiles) => {
      setErrorMessageValidate("");
      setIsDirty(true);
      setRejectedFiles([]);
      if (rejectedFiles.length > 0) {
        setErrorMessageValidate(
          "Is not supported. The image must be in JPG, PNG, SVG or GIF format."
        );
        setRejectedFiles(rejectedFiles);
      } else {
        if (acceptedFiles.length) {
          if (acceptedFiles[0].size <= 2 * 1000 * 1000) {
            const fileType = acceptedFiles[0].type.toLowerCase();
            if (
              fileType.includes("/jpeg") ||
              fileType.includes("/gif") ||
              fileType.includes("/png") ||
              fileType.includes("/svg")
            ) {
              setFiles((files) => [...files, ...acceptedFiles]);
              reader.readAsDataURL(acceptedFiles[0]);
            } else {
              setRejectedFiles(acceptedFiles);
              setErrorMessageValidate(
                "The image must be in JPG, PNG, SVG or GIF format. The maximum size is 2MB."
              );
            }
          } else {
            setRejectedFiles(acceptedFiles);
            setErrorMessageValidate(
              "The uploaded image is too large, the max image size is 2MB."
            );
          }
        }
      }
    },
    []
  );

  const fileUpload = !files.length && <DropZone.FileUpload />;

  const handleLabelNameChange = useCallback((value) => {
    setLabelName(value);
    if (value.length > 0) {
      setErrorSaveLabel("");
    }
    setIsDirty(true);
  }, []);
  const toggleModalSaveImage = useCallback(() => {
    handleDeactivateObject();
    setActiveSaveImage((activeSaveImage) => !activeSaveImage);
    setLabelName("");
  }, []);

  const handleSaveImageToLocal = useCallback(() => {
    if (labelName) {
      handleSaveFile(labelName);
      toggleModalSaveImage();
    } else {
      setErrorSaveLabel("Label name can not blank");
    }
  }, [labelName]);

  const handleSaveImageToServer = useCallback(() => {
    if (labelName) {
      handleSaveToMyLabelLib(labelName);
      toggleModalSaveImage();
    } else {
      setErrorSaveLabel("Label name can not blank");
    }
    setIsDirty(true);
  }, [labelName]);

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

  const handleShowContextMenu = useCallback((e) => {
    e.preventDefault();
    let showMenu = true;
    let clickObject = false;
    const pointEvent = window.event;
    if (pointEvent.target.className.includes("Polaris-Button")) {
      showMenu = false;
    }
    const clickPoint = new fabric.Point(
      pointEvent.offsetX + 2,
      pointEvent.offsetY + 2
    );
    canvas.forEachObject(function (obj) {
      if (showMenu && obj.containsPoint(clickPoint)) {
        if (obj.get("type").includes("text")) {
          setIsSelectedText(true);
        } else {
          setIsSelectedText(false);
        }
        canvas.setActiveObject(obj);
        canvas.requestRenderAll();
        clickObject = true;
      }
    });

    if (showMenu) {
      setContextMenu({
        top: e.pageY - 10,
        left: e.pageX - 40,
        isObject: clickObject,
      });
    }
  }, []);

  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message={"Unsaved changes"}
      saveAction={{
        onAction: () => toggleModalSaveImage(),
        content: "Save",
        loading: buttonSaveLoading,
      }}
    />
  ) : null;
  return (
    <div className="page-wrapper">
      {contextualSaveBarMarkup}
      {successSaveMessage && (
        <div className="bss-pl__message-container-wrapper">
          <div className="bss-pl__message-container">
            <div className="bss-pl__message-text">
              <span className="bs-pl__message-icon">&#10003;</span>{" "}
              <span>{successSaveMessage}</span>
            </div>
          </div>
        </div>
      )}
      <div className="bss-container-editor">
        <div>
          {errorMessage}
          <div className="bss-image-editor-header">
            <TextStyle variation="negative">{failedSaveMessage}</TextStyle>
          </div>
          <Modal
            open={activeSaveImage}
            onClose={toggleModalSaveImage}
            title="Save Label"
            primaryAction={{
              content: "Save To Computer",
              onAction: handleSaveImageToLocal,
            }}
            secondaryActions={{
              content: "Save To My Label Lib",
              onAction: handleSaveImageToServer,
            }}
          >
            <Modal.Section>
              <Stack vertical>
                <Stack.Item fill>
                  <TextField
                    label="Label Name"
                    id="labelSaveName"
                    value={labelName}
                    onChange={handleLabelNameChange}
                  />
                  <InlineError
                    message={errorSaveLabel}
                    fieldID="labelSaveName"
                  />
                </Stack.Item>
              </Stack>
            </Modal.Section>
          </Modal>
          <div className="editor-wrapper">
            <div className="bss-image-editor-controls">
              <ul className="bss-image-editor-menu">
                <li
                  onMouseEnter={() => setActiveToolTip(tooltips.image)}
                  onMouseLeave={() => setActiveToolTip(false)}
                  onClick={() => handleShowMenuToolArea(mode.image)}
                  className={classNames("bss-image-editor-item", {
                    active: currentMode == mode.image,
                  })}
                >
                  <Icon color="subdued" source={SlideshowMajor} />
                </li>
                <li
                  onMouseEnter={() => setActiveToolTip(tooltips.select)}
                  onMouseLeave={() => setActiveToolTip(false)}
                  onClick={() => handleShowMenuToolArea(mode.select)}
                  className={classNames("bss-image-editor-item", {
                    active: currentMode == mode.select,
                  })}
                >
                  <Icon color="subdued" source={BehaviorMajor} />
                </li>
                <li
                  onMouseEnter={() => setActiveToolTip(tooltips.text)}
                  onMouseLeave={() => setActiveToolTip(false)}
                  onClick={() => handleShowMenuToolArea(mode.text)}
                  className={classNames("bss-image-editor-item", {
                    active: currentMode == mode.text,
                  })}
                >
                  <Icon color="subdued" source={TypeMajor} />
                </li>
                <li
                  onMouseEnter={() => setActiveToolTip(tooltips.brush)}
                  onMouseLeave={() => setActiveToolTip(false)}
                  onClick={() => handleShowMenuToolArea(mode.pen)}
                  className={classNames("bss-image-editor-item", {
                    active: currentMode == mode.pen,
                  })}
                >
                  <Icon color="subdued" source={PaintBrushMajor} />
                </li>
                <li
                  onMouseEnter={() => setActiveToolTip(tooltips.front)}
                  onMouseLeave={() => setActiveToolTip(false)}
                  onClick={() => handleBringToFront()}
                  className={classNames("bss-image-editor-item")}
                >
                  <Icon color="subdued" source={CircleChevronUpMinor} />
                </li>
                <li
                  onMouseEnter={() => setActiveToolTip(tooltips.back)}
                  onMouseLeave={() => setActiveToolTip(false)}
                  onClick={() => handleSendToBack()}
                  className={classNames("bss-image-editor-item")}
                >
                  <Icon color="subdued" source={CircleChevronDownMinor} />
                </li>
                <li
                  onMouseEnter={() => setActiveToolTip(tooltips.remove)}
                  onMouseLeave={() => setActiveToolTip(false)}
                  onClick={() => handleRemoveObject()}
                  className={classNames("bss-image-editor-item")}
                >
                  <Icon color="subdued" source={CircleCancelMajor} />
                </li>
                <li
                  onMouseEnter={() => setActiveToolTip(tooltips.clear)}
                  onMouseLeave={() => setActiveToolTip(false)}
                  onClick={() => handleModalClearCanvas()}
                  className={classNames("bss-image-editor-item")}
                >
                  <Icon color="subdued" source={DeleteMajor} />
                </li>
              </ul>
              <div
                id="tooltip-arrange"
                className={classNames("tooltip", {
                  active: activeToolTip == tooltips.select,
                })}
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
                className={classNames("tooltip", {
                  active: activeToolTip == tooltips.text,
                })}
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
                className={classNames("tooltip", {
                  active: activeToolTip == tooltips.image,
                })}
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
                className={classNames("tooltip", {
                  active: activeToolTip == tooltips.brush,
                })}
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
                className={classNames("tooltip", {
                  active: activeToolTip == tooltips.front,
                })}
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
                className={classNames("tooltip", {
                  active: activeToolTip == tooltips.back,
                })}
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
                className={classNames("tooltip", {
                  active: activeToolTip == tooltips.remove,
                })}
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
                className={classNames("tooltip", {
                  active: activeToolTip == tooltips.clear,
                })}
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
              <Modal
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
              </Modal>
            </div>
            <div className="bss-image-editor-main">
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
                          className={classNames(
                            "text-style",
                            "style-underline",
                            { "text-style-active": textUnderline }
                          )}
                        >
                          U
                        </span>
                        <span
                          onClick={handleToggleTextItalic}
                          className={classNames("text-style", "style-italic", {
                            "text-style-active": textItalic,
                          })}
                        >
                          I
                        </span>
                        <span
                          onClick={handleToggleTextBold}
                          className={classNames("text-style", "style-bold", {
                            "text-style-active": textBold,
                          })}
                        >
                          B
                        </span>
                      </div>
                      <div className="editor-title">Text color</div>
                      <Stack vertical={false}>
                        <TextField
                          type={"color"}
                          value={labelTextColor}
                          name={"label_text_color"}
                          onChange={handleLabelTextColorChange}
                        />
                        <span
                          onClick={() =>
                            handleQuickSelectLabelTextColor("#375e97")
                          }
                        >
                          <ColorCircle color={"#375e97"} />
                        </span>
                        <span
                          onClick={() =>
                            handleQuickSelectLabelTextColor("#fb6542")
                          }
                        >
                          <ColorCircle color={"#fb6542"} />
                        </span>
                        <span
                          onClick={() =>
                            handleQuickSelectLabelTextColor("#ffbb00")
                          }
                        >
                          <ColorCircle color={"#ffbb00"} />
                        </span>
                        <span
                          onClick={() =>
                            handleQuickSelectLabelTextColor("#f18d9e")
                          }
                        >
                          <ColorCircle color={"#f18d9e"} />
                        </span>
                        <span
                          onClick={() =>
                            handleQuickSelectLabelTextColor("#3681ce")
                          }
                        >
                          <ColorCircle color={"#3681ce"} />
                        </span>
                      </Stack>

                      <div className="toggle-menu-item">
                        <div className="font-w-7">Background</div>
                        <label className="switch">
                          <input
                            onClick={handleToggleBackground}
                            type="checkbox"
                          />
                          <span className="slider round" />
                        </label>
                      </div>
                      {showBackgroundFied && (
                        <div>
                          <div className="editor-title">Color</div>
                          <Stack vertical={false}>
                            <TextField
                              type={"color"}
                              value={backgroundTextColor}
                              onChange={handleBackgroundTextColorChange}
                            />
                            <span
                              onClick={() =>
                                handleQuickSelectBackgroundText("#375e97")
                              }
                            >
                              <ColorCircle color={"#375e97"} />
                            </span>
                            <span
                              onClick={() =>
                                handleQuickSelectBackgroundText("#fb6542")
                              }
                            >
                              <ColorCircle color={"#fb6542"} />
                            </span>
                            <span
                              onClick={() =>
                                handleQuickSelectBackgroundText("#ffbb00")
                              }
                            >
                              <ColorCircle color={"#ffbb00"} />
                            </span>
                            <span
                              onClick={() =>
                                handleQuickSelectBackgroundText("#f18d9e")
                              }
                            >
                              <ColorCircle color={"#f18d9e"} />
                            </span>
                            <span
                              onClick={() =>
                                handleQuickSelectBackgroundText("#3681ce")
                              }
                            >
                              <ColorCircle color={"#3681ce"} />
                            </span>
                          </Stack>
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
                          <Stack vertical={false}>
                            <TextField
                              type={"color"}
                              value={strokeColor}
                              onChange={handleStrokeColorChange}
                            />
                            <span
                              onClick={() =>
                                handleQuickSelectStrokeColor("#375e97")
                              }
                            >
                              <ColorCircle color={"#375e97"} />
                            </span>
                            <span
                              onClick={() =>
                                handleQuickSelectStrokeColor("#fb6542")
                              }
                            >
                              <ColorCircle color={"#fb6542"} />
                            </span>
                            <span
                              onClick={() =>
                                handleQuickSelectStrokeColor("#ffbb00")
                              }
                            >
                              <ColorCircle color={"#ffbb00"} />
                            </span>
                            <span
                              onClick={() =>
                                handleQuickSelectStrokeColor("#f18d9e")
                              }
                            >
                              <ColorCircle color={"#f18d9e"} />
                            </span>
                            <span
                              onClick={() =>
                                handleQuickSelectStrokeColor("#3681ce")
                              }
                            >
                              <ColorCircle color={"#3681ce"} />
                            </span>
                          </Stack>

                          <div className="editor-title">Stroke Width</div>
                          <RangeSlider
                            value={strokeWidth}
                            onChange={handleStrokeWidthChange}
                            min={0}
                            max={10}
                            output
                          />
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
                  <Stack vertical={false}>
                    <TextField
                      type={"color"}
                      value={brushColor}
                      name={"brush_color"}
                      onChange={handleChangeBrushColor}
                    />
                    <span
                      onClick={() => handleQuickSelectBrushColor("#375e97")}
                    >
                      <ColorCircle color={"#375e97"} />
                    </span>
                    <span
                      onClick={() => handleQuickSelectBrushColor("#fb6542")}
                    >
                      <ColorCircle color={"#fb6542"} />
                    </span>
                    <span
                      onClick={() => handleQuickSelectBrushColor("#ffbb00")}
                    >
                      <ColorCircle color={"#ffbb00"} />
                    </span>
                    <span
                      onClick={() => handleQuickSelectBrushColor("#f18d9e")}
                    >
                      <ColorCircle color={"#f18d9e"} />
                    </span>
                    <span
                      onClick={() => handleQuickSelectBrushColor("#3681ce")}
                    >
                      <ColorCircle color={"#3681ce"} />
                    </span>
                  </Stack>

                  <div className="editor-title">Width</div>
                  <RangeSlider
                    value={brushWidth}
                    onChange={handleChangeBrushWidth}
                    min={1}
                    max={30}
                    output
                  />
                </div>
              )}

              {currentMode == mode.image && (
                <div>
                  <ul id="add-image-category-list" className="section-list">
                    <li
                      onClick={() => setOpenFileDialog(true)}
                      data="browse"
                      id="add-image-browse"
                    >
                      <span>Upload Your Image</span>
                      <DropZone
                        onFileDialogClose={() => setOpenFileDialog(false)}
                        openFileDialog={openFileDialog}
                        allowMultiple={false}
                        accept="image/*"
                        type="image"
                        onDrop={handleDrop}
                      >
                        {fileUpload}
                      </DropZone>
                    </li>
                    {/*pending this feature*/}
                    {/*<li onClick={toggleModalUrlImage} data="url" id="add-image-url"><span>Select From Url</span></li>*/}
                    <li
                      onClick={togglePopoverActive}
                      data="stock"
                      id="add-image-stock"
                    >
                      <span>Select From Our Stock</span>
                    </li>
                  </ul>
                  <Modal
                    open={activeUrlImage}
                    onClose={toggleModalUrlImage}
                    title="Open image URL"
                    primaryAction={{
                      content: "Close",
                      onAction: toggleModalUrlImage,
                    }}
                  >
                    <Modal.Section>
                      <Stack vertical>
                        <Stack.Item fill>
                          <TextField
                            label="Image URL"
                            value={imageUrl}
                            onChange={handleImageUrlChange}
                            connectedRight={
                              <Button primary onClick={handleOpenImageFromUrl}>
                                Open
                              </Button>
                            }
                          />
                        </Stack.Item>
                      </Stack>
                    </Modal.Section>
                  </Modal>
                </div>
              )}
            </div>
            <div
              className="main-canvas-container"
              onContextMenu={handleShowContextMenu}
            >
              <div className="main-canvas-area">
                <div className="bss-main-button-canvas">
                  <Button id="undo" disabled={statusUndo}>
                    Undo <Icon source={UndoMajor} color="subdued" />
                  </Button>
                  <Button id="redo" disabled={statusRedo}>
                    <Icon source={RedoMajor} color="subdued" /> Redo
                  </Button>
                </div>
                <canvas id="canvas"></canvas>
              </div>
              <CanvasMenu
                contextMenu={contextMenu}
                clear={() => setContextMenu(null)}
                uploadImage={async () => {
                  setOpenFileDialog(true);
                  if (currentMode !== mode.image)
                    handleShowMenuToolArea(mode.image);
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
                remove={deleteSelectedObjects}
              />
            </div>
          </div>

          <div
            id="select-designed-labels"
            style={{ display: "none" }}
            className={
              popoverActive
                ? "select-designed-labels-active"
                : "select-designed-labels-inactive"
            }
          >
            <div className="vertical-list-label">
              {activeSearchResult && (
                <div className="label-search-result bss-scrollbar">
                  <ResourceList
                    resourceName={resourceName}
                    items={labelList}
                    renderItem={renderItem}
                  />
                </div>
              )}

              <TextField
                label={"Search"}
                labelHidden={true}
                value={searchText}
                prefix={<Icon source={SearchMinor} color="subdued" />}
                onChange={handleSearchTextChange}
                placeholder="Search label here ..."
              />
            </div>

            <div className="horizontal-list-label">
              <div className="select-tab-libs-wrapper">
                <Card>
                  <Tabs
                    tabs={labelLibsTabs}
                    selected={selectedLib}
                    onSelect={handleLibTabChange}
                  >
                    <Card>
                      {labelLibsTabs[selectedLib].locked && (
                        <div className="bss-pl-locked-lib">
                          <p>
                            <span>
                              These label images are available for{" "}
                              <strong>
                                {labelLibsTabs[selectedLib].id <= 19
                                  ? "Pro Plan & "
                                  : ""}
                                Advanced Plan
                              </strong>{" "}
                              only. Please{" "}
                            </span>
                            <span
                              className="bss-pl__upgrade-now-btn"
                              onClick={() => Router.push("/pricing-plans")}
                            >
                              Upgrade Now
                            </span>
                          </p>
                        </div>
                      )}
                      <ResourceList
                        resourceName={{
                          singular: "label template",
                          plural: "label templates",
                        }}
                        selectedItems={selectedItems}
                        onSelectionChange={setSelectedItems}
                        items={labelLibsTabs[selectedLib].label_templates}
                        renderItem={(item) => {
                          let locked = labelLibsTabs[selectedLib].locked;
                          let content = "";
                          const { id, name, path, lib_id, public_url } = item;
                          if (lib_id == undefined) {
                            const media =
                              public_url && public_url.length ? (
                                <Avatar
                                  source={public_url}
                                  customer
                                  size="large"
                                  name={name}
                                />
                              ) : (
                                <Avatar
                                  source={`/images/customer/${item.domain_id}/${path}`}
                                  customer
                                  size="large"
                                  name={name}
                                />
                              );
                            content = (
                              <div className={`bss-customer-label-${id}`}>
                                <div
                                  className={
                                    selectedLibLabel == id
                                      ? "bss-lib-selected-label"
                                      : ""
                                  }
                                >
                                  <ResourceItem
                                    id={id}
                                    media={media}
                                    accessibilityLabel={`${name}`}
                                    onClick={() => {
                                      !locked &&
                                        handleSelectedCustomLabel(item);
                                    }}
                                  ></ResourceItem>
                                </div>
                                <div
                                  className="delete-btn"
                                  onClick={() => handleDeleteCustomLabel(item)}
                                >
                                  <Icon source={DeleteMajor} color="orange" />
                                </div>
                              </div>
                            );
                            return content;
                          } else {
                            const media = (
                              <Avatar
                                source={`/static/adminhtml/template_libs/${lib_id}/${path}`}
                                crossOrigin="anonymous"
                                customer
                                size="large"
                                name={name}
                              />
                            );
                            const isSticker = name === "z_request_sticker";
                            if (!isSticker) {
                              content = (
                                <div
                                  className={
                                    selectedLibLabel == id
                                      ? "bss-lib-selected-label"
                                      : ""
                                  }
                                >
                                  <ResourceItem
                                    id={id}
                                    media={media}
                                    accessibilityLabel={`${name}`}
                                    onClick={() => {
                                      !locked && handleSelectedLabel(item);
                                    }}
                                  ></ResourceItem>
                                </div>
                              );
                            } else {
                              content = (
                                <div>
                                  <Link
                                    url="https://form.jotform.com/202311666162043"
                                    external={true}
                                  >
                                    <ResourceItem
                                      id={id}
                                      media={media}
                                      accessibilityLabel={`Request Sticker`}
                                    ></ResourceItem>
                                  </Link>
                                </div>
                              );
                            }
                            return content;
                          }
                        }}
                      />
                    </Card>
                  </Tabs>
                </Card>
                <span
                  className="select-designed-labels-close"
                  onClick={togglePopoverActive}
                >
                  <Icon source={MobileCancelMajor} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { res } = ctx;
  const allCookies = cookies(ctx);
  let id = ctx.query.id;
  let shop = allCookies.shopOrigin;
  let accessToken = allCookies.accessToken;
  let configData = {};
  let labelTemplatesData = [];
  let customerLabelsData = [];
  let countries = [];
  let allCustomerTag = [];
  let currentPlan = "free";
  let shopId = false;
  if (shop && accessToken) {
    const getShopByDomain = await fetch(`${API_URL}/shop/getShopDataByDomain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain: shop }),
    });
    const shopData = await getShopByDomain.json();
    if (
      !shopData.success ||
      !shop ||
      !accessToken ||
      (shopData.shop && shopData.shop.token != accessToken)
    ) {
      res.writeHead(302, {
        Location: "/login.html",
      });
      res.end();
      return { props: {} };
    }
    shopId = shopData.success ? shopData.shop.id : false;
    const planInfo = await fetch(`${API_URL}/plan/getCurrentPlan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop: shop }),
    });
    const plan = await planInfo.json();
    if (plan && plan.success) {
      currentPlan = plan.currentPlan;
    }
    const labelTemplatesRes = await fetch(
      `${API_URL}/getLabelTemplatesByPlan`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shop: shop,
          accessToken: allCookies.accessToken,
          planCode: "ten_usd",
        }),
      }
    );
    let labelTemplates = await labelTemplatesRes.json();
    if (labelTemplates.success && labelTemplates.data) {
      labelTemplatesData = labelTemplates.data;
    }
    if (labelTemplates.success && labelTemplates.customerLabel) {
      customerLabelsData = labelTemplates.customerLabel;
    }
  } else {
    res.writeHead(302, {
      Location: "/login.html",
    });
    res.end();
    return { props: {} };
  }
  return {
    props: {
      shopId: shopId,
      labelTemplatesData: labelTemplatesData,
      currentPlan: currentPlan,
      customerLabelsData: customerLabelsData,
      shop: shop,
    },
  };
}
