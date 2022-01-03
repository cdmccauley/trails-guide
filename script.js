// input element
const fileInput = document.getElementById("fileInput");

// "state"
let documents = {};

// helper functions
const getFeedback = (name, result) => {
  console.log(
    `%c ${result ? "PASSED" : "FAILED"} ${name} test `,
    `background: ${result ? "green" : "red"}; color: white; border-radius: 3px;`
  );
};

const attributeTest = (expected, actual) => {
  let result = false;
  // console.log(Object.keys(actual).reduce((passed, key) => passed && expected[key.name] ? true : false, true))
  result = Array.from(actual).reduce((passed, key) => passed && expected[key.name], true);
  // console.log(actual["lng"]);
  return result;
};

// test functions
const doctypeTest = (doc) => {
  let result = false;
  const element = doc.doctype;
  if (element) {
    const type = element.toString().toLowerCase() === "[object documenttype]";
    const children = element.childNodes.length === 0;
    const siblings = element.nextSibling.tagName.toLowerCase() === "html";
    const parent = element.parentElement === null;
    const attributes = element.name.toLowerCase() === "html";
    result = type && children && siblings && parent && attributes;
  }
  getFeedback("<!DOCTYPE>", result);
};

const htmlTest = (doc) => {
  let result = false;
  const elements =
    doc.all !== undefined && doc.all.length > 0
      ? Array.from(doc.all).filter((e) => e.tagName.toLowerCase() === "html")
      : undefined;
  if (elements && elements.length === 1) {
    const element = elements.pop();
    console.log(element);
    const children = element.childElementCount === 2;
    const previousSibling =
      element.previousSibling.toString().toLowerCase() ===
      "[object documenttype]";
    const nextSibling = element.nextSibling === null;
    const parent = element.parentElement === null;
    // const attributes = element.lang.toLowerCase() === "en";
    // const attributes =
    //   Array.from(element.attributes).length === 1 &&
    //   element.attributes.lang.value.toLowerCase() === "en";
    const expectedAttributes = { lang: "en" };
    const attributes = attributeTest(expectedAttributes, element.attributes);
    result = children && previousSibling && nextSibling && parent && attributes;
  }
  getFeedback("<html>", result);
};

// app functions
const analyzeDoc = (doc) => {
  doctypeTest(doc);
  htmlTest(doc);
};

const persistDoc = (file, doc) => {
  documents[file] = doc;
  analyzeDoc(doc);
};

const handleFiles = (event) => {
  const files = [...event.target.files];
  files.map((file) => {
    if (file.type === "text/html") {
      const read = new FileReader();
      read.readAsBinaryString(file);
      read.onloadend = () =>
        persistDoc(
          file.name,
          new DOMParser().parseFromString(read.result, "text/html")
        );
    }
  });
  // files read into memory
};

const stopAndPrevent = (event) => {
  event.stopPropagation();
  event.preventDefault();
};

const drop = (event) => {
  stopAndPrevent(event);
  const mockEvent = {
    target: {
      files: event.dataTransfer.files,
    },
  };
  handleFiles(mockEvent);
};

const click = (event) => {
  stopAndPrevent(event);
  const dialog = document.createElement("input");
  dialog.setAttribute("type", "file");
  dialog.setAttribute("multiple", true);
  dialog.addEventListener("change", handleFiles, false);
  dialog.click();
};

// script
fileInput.addEventListener("dragenter", stopAndPrevent, false);
fileInput.addEventListener("dragover", stopAndPrevent, false);
fileInput.addEventListener("drop", drop, false);
fileInput.addEventListener("click", click, false);
