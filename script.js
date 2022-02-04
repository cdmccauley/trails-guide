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
  result = Array.from(actual).reduce(
    (passed, key) =>
      passed && expected[key.name] && expected[key.name] === key.value,
    true
  );
  return result;
};

/*/
 * test functions
/*/
const doctypeTest = (doc) => {
  let result = false;
  const element = doc.doctype;
  console.log(element);
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
    const nextSibling = element.nextElementSibling === null;
    const parent = element.parentElement === null;
    const expectedAttributes = { lang: "en" };
    const attributes = attributeTest(expectedAttributes, element.attributes);
    result = children && previousSibling && nextSibling && parent && attributes;
  }
  getFeedback("<html>", result);
};

const headTest = (doc) => {
  let result = false;
  const elements =
    doc.all !== undefined && doc.all.length > 0
      ? Array.from(doc.all).filter((e) => e.tagName.toLowerCase() === "head")
      : undefined;
  if (elements && elements.length === 1) {
    const element = elements.pop();
    console.log(element);
    const children = element.childElementCount === 2;
    const previousSibling = element.previousElementSibling === null;
    const nextSibling =
      element.nextElementSibling.tagName.toLowerCase() === "body";
    const parent = element.parentElement.tagName.toLowerCase() === "html";
    result = children && previousSibling && nextSibling && parent;
  }
  getFeedback("<head>", result);
};

const bodyTest = (doc) => {
  let result = false;
  const elements =
    doc.all !== undefined && doc.all.length > 0
      ? Array.from(doc.all).filter((e) => e.tagName.toLowerCase() === "body")
      : undefined;
  if (elements && elements.length === 1) {
    const element = elements.pop();
    console.log(element); // WORKING HERE
    const children = element.childElementCount === 4;
    const previousSibling = element.previousElementSibling.tagName.toLowerCase() === "head";
    const nextSibling = element.nextElementSibling === null;
    const parent = element.parentElement.tagName.toLowerCase() === "html";
    result = children && previousSibling && nextSibling && parent;
  }
  getFeedback("<body>", result);
};

/*/
 * app functions
/*/
const analyzeDoc = (doc) => {
  doctypeTest(doc);
  htmlTest(doc);
  headTest(doc);
  bodyTest(doc);
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
