"use strict";

// Select audio files
const addAudio = document.querySelector("#addAudio");
const addImageAudio = document.querySelector("#addImageAudio");
const deleteAudio = document.querySelector("#deleteAudio");
const warningEmptyAudio = document.querySelector("#warningEmptyAudio");
const warningSelectAudio = document.querySelector("#warningSelectAudio");
const warningNameTakenAudio = document.querySelector("#warningNameTakenAudio");
const tabAudio = document.querySelector("#tabAudio");
const btnAudio = document.querySelector("#btnAudio");
const cancelAudio = document.querySelector("#cancelAudio");
const wrongAudio = document.querySelector("#wrongAudio");
// Global variable's
// This is the Main array that holds all the year objects
const arrayOfYearObjs = [];
// create elements object
const el = new Elements();
// create display object
const display = new Display(el, $);
// create tax percent
let taxRate = 0.06;
// create year index
let yearIndex = -243;
// create month index
let monthIndex = -243;
// temp hold for array
let settingsArrayContainer;
//The start of program exicution.
window.onload = function () {
  addDateToForm();
  startUp();
};

//startUp
function startUp() {
  //get data from settings obect
  let settingsStorage = new SettingsStorage();
  let settings = settingsStorage.getSettingsFromFile();

  if (settings.type === "momMoney") {
    // set the holding array
    settingsArrayContainer = settings.filePathArray;
    // loadsettings
    applySettings(settings);
    // update Form
    display.showAutoLoadList(settingsArrayContainer);

    if (el.autoLoadCheckBox.checked) {
      if (settings.filePathArray) {
        // autoLoadYearObjects(settings.filePathArray);
        sendAutoLoadFilesToNode(settings.filePathArray);
      }
    }
  }
}

function sendAutoLoadFilesToNode(filePaths) {
  window.api.sendFilePathsForAutoload(filePaths);
}
//*************************************************** */
// Helper functions
//*************************************************** */
// *****************************************************
// ****************************************************
function removeActiveClass(element) {
  if (element) {
    element.classList.remove("active");
  }
}
// ******************************************************
function addDateToForm() {
  let date = new Date();
  el.dateInput.value = date.toLocaleDateString();
}
// **********************************************
function pushFileSettingsContainer(filePath) {
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;

  for (const element of settingsArrayContainer) {
    if (element === filePath) {
      isTaken = true;
    }
  }
  if (isTaken) {
    // warningNameTakenAudio.play();
    warningNameTakenAudio.play();
    display.showAlert("That file is already loaded!", "error");
    return;
  }
  // add it too tempHOld
  settingsArrayContainer.push(filePath);
}
// ****************************************************
function sortArrayByName(array) {
  array.sort(function (a, b) {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be eimagePathual
    return 0;
  }); //End sort function
}
// ***************************************************
function getRadioValue(form, name) {
  let val;
  // get list of radio buttons with specified name
  const radios = form.elements[name];
  // loop through list of radio buttons
  for (let i = 0, len = radios.length; i < len; i++) {
    if (radios[i].checked) {
      // radio checked?
      val = radios[i].value; // if so, hold its value in val
      break; // and break out of for loop
    }
  }
  return val; // return value of checked radio or undefined if none checked
}
// *******************************************************
function mapOutKey(key, array) {
  const newArray = array.map(function (item) {
    return item[key];
  });
  return newArray;
}
// *****************************************************

// **************************************************
function loadUpSettingsForm() {
  const settingsStorage = new SettingsStorage();
  const settings = settingsStorage.getSettingsFromFile();
  settingsArrayContainer = settings.filePathArray;

  if (settings.type === "momMoney") {
    //set the tax rate text input
    el.taxRateInput.value = settings.taxRate;

    // set check box
    el.autoLoadCheckBox.checked = settings.autoLoad;

    // check the right font size
    switch (settings.fontSize) {
      case "x-small":
        el.xSmallRadio.checked = true;
        break;
      case "small":
        el.smallRadio.checked = true;
        break;
      case "normal":
        el.normalRadio.checked = true;
        break;
      case "large":
        el.largeRadio.checked = true;
        break;
      case "x-large":
        el.xLargeRadio.checked = true;
        break;
      default:
        console.log("No valid font size");
    }
  }
  // update autoload form ul
  display.showAutoLoadList(settingsArrayContainer);
} // End loadUpSettingsForm()
// ******************************************
function applySettings(settings) {
  el.autoLoadCheckBox.checked = settings.autoLoad;
  // set tax variable
  taxRate = settings.taxRate;
  el.taxSpan.textContent = `${settings.taxRate}%`;

  switch (settings.fontSize) {
    case "x-small":
      el.root.style.fontSize = "10px";
      break;
    case "small":
      el.root.style.fontSize = "12px";
      break;
    case "normal":
      el.root.style.fontSize = "16px";
      break;
    case "large":
      el.root.style.fontSize = "20px";
      break;
    case "x-large":
      el.root.style.fontSize = "24px";
      break;
    default:
      console.log("No valid font-size");
  }
} // End

// *************************************************************
//  IPC Code
// *************************************************************

window.api.handleNewYear((event, { name, path }) => {
  if (!name || !path) {
    wrongAudio.play();
    display.showAlert("Error creating a year", "error");
    return;
  }
  let pathIsTaken = false;

  for (const year of arrayOfYearObjs) {
    if (year.fileNamePath === path) {
      pathIsTaken = true;
    }
  }

  if (pathIsTaken) {
    display.showAlert("That year is already loaded", "error");
    return;
  }

  let nameIsTaken = false;

  for (const year of arrayOfYearObjs) {
    if (year.name === name) {
      nameIsTaken = true;
    }
  }
  if (nameIsTaken) {
    display.showAlert(`A year file called ${name} is already loaded`, "error");
    return;
  }

  // const newYear = new YearObject(dataObj.name, dataObj.fileNamePath);
  const newYear = new YearObject(name, path);
  // create the 12 months
  const January = new MonthObject("January");
  newYear.arrayOfMonthObjects.push(January);
  const February = new MonthObject("February");
  newYear.arrayOfMonthObjects.push(February);
  const March = new MonthObject("March");
  newYear.arrayOfMonthObjects.push(March);
  const April = new MonthObject("April");
  newYear.arrayOfMonthObjects.push(April);
  const May = new MonthObject("May");
  newYear.arrayOfMonthObjects.push(May);
  const June = new MonthObject("June");
  newYear.arrayOfMonthObjects.push(June);
  const July = new MonthObject("July");
  newYear.arrayOfMonthObjects.push(July);
  const August = new MonthObject("August");
  newYear.arrayOfMonthObjects.push(August);
  const September = new MonthObject("September");
  newYear.arrayOfMonthObjects.push(September);
  const October = new MonthObject("October");
  newYear.arrayOfMonthObjects.push(October);
  const November = new MonthObject("November");
  newYear.arrayOfMonthObjects.push(November);
  const December = new MonthObject("December");
  newYear.arrayOfMonthObjects.push(December);
  // push the year obj into the array of year objects
  arrayOfYearObjs.push(newYear);
  sortArrayByName(arrayOfYearObjs);
  // write the year object to disk
  // window api's #################################################################
  saveYear(newYear);
  display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
});

// *************************************************************
//  End IPC Code
// *************************************************************
// *************************************************************
//  Year Code
// *************************************************************
el.yearList.addEventListener("click", (e) => {
  // event delegation
  if (e.target.classList.contains("year")) {
    const element = document.querySelector(".year.active");
    removeActiveClass(element);
    // add active class
    e.target.classList.add("active");

    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);
    if (isNaN(index)) {
      return;
    }
    yearIndex = index;
    tabAudio.play();
    // get the array of months and send it to display
    display.paintMonthTabs(
      mapOutKey("name", arrayOfYearObjs[yearIndex].arrayOfMonthObjects)
    );
    return;
  } // End code to set the active class
}); // End el.yearList.addEventListener()
// *************************************************************
//  End Year Code
// *************************************************************
// *************************************************************
//  Month Code
// *************************************************************
el.monthList.addEventListener("click", (e) => {
  // event delegation
  if (e.target.classList.contains("month")) {
    const element = document.querySelector(".month.active");
    removeActiveClass(element);
    // add active class
    e.target.classList.add("active");
    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);
    if (isNaN(index)) {
      return;
    }
    monthIndex = index;
    tabAudio.play();
    // get the array of Transactions and send it to display
    display.paintTransactions(
      arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex]
        .arrayOfTransactions
    );
    return;
  } // End code to set the active class
});
// *************************************************************
//  End Month Code
// *************************************************************
// *************************************************************
//  Transaction Code
// *************************************************************
// Transaction UL
el.transactionList.addEventListener("click", (e) => {
  // get the index from the html
  let index = e.target.parentElement.parentElement.dataset.index;
  if (isNaN(index)) {
    return;
  }
  const deleteIndex = parseInt(index);
  // event delegation
  if (e.target.classList.contains("deleteTrans")) {
    if (!e.ctrlKey) {
      warningNameTakenAudio.play();
      display.showAlert(
        "Please hold down control and click on the trash can to delete!",
        "error"
      );
      return;
    }

    if (e.ctrlKey) {
      deleteAudio.play();
      display.showAlert("You deleted a transaction!", "success", 2500);
      // delete transaction
      arrayOfYearObjs[yearIndex].arrayOfMonthObjects[
        monthIndex
      ].arrayOfTransactions.splice(deleteIndex, 1);
      // save to disk
      saveYear(arrayOfYearObjs[yearIndex]);
      // get the array of Transactions and send it to display
      display.paintTransactions(
        arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex]
          .arrayOfTransactions
      );
    }
  }
});

// transaction form add Btn
el.transactionSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const date = el.dateInput.value.trim();
  const storeItem = el.storeItemInput.value.trim();
  let price = el.priceInput.value.trim();
  // set time out to focus
  window.setTimeout(function () {
    el.storeItemInput.focus();
  }, 2000);
  if (!date) {
    warningEmptyAudio.play();
    display.showAlert("Please enter a date!", "error");
    return;
  }

  if (!storeItem) {
    warningEmptyAudio.play();
    display.showAlert("Please enter a store or item!", "error");
    return;
  }

  if (!price) {
    warningEmptyAudio.play();
    display.showAlert("Please enter a price!", "error");
    return;
  }
  price = Number(price);

  if (isNaN(price)) {
    warningNameTakenAudio.play();
    display.showAlert("Please enter a number for the price!", "error");
    return;
  }
  let newTransaction;
  if (el.taxInputCheckBox.checked) {
    // create transaction with tax
    const tax = price * taxRate;
    newTransaction = new Transaction(date, storeItem, price, tax);
    el.taxInputCheckBox.checked = false;
  } else {
    // create transaction without tax
    newTransaction = new Transaction(date, storeItem, price);
  }
  display.showAlert("You added a transaction!", "success");
  addAudio.play();
  // push new transaction into array
  arrayOfYearObjs[yearIndex].arrayOfMonthObjects[
    monthIndex
  ].arrayOfTransactions.push(newTransaction);
  // save to disk
  saveYear(arrayOfYearObjs[yearIndex]);
  // get the array of Transactions and send it to display
  display.paintTransactions(
    arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex]
      .arrayOfTransactions
  );
});

// transaction form clear Btn
el.transactionClearBtn.addEventListener("click", (e) => {
  btnAudio.play();
  el.storeItemInput.value = "";
  el.priceInput.value = "";
  // set time out to focus
  window.setTimeout(function () {
    el.storeItemInput.focus();
  }, 2000);
  return;
});
// *************************************************************
//  End Transaction Code
// *************************************************************
// ***********************************************************
// Settings Code
// *************************************************************
// when You click on save settings Btn
el.saveSettingsSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // get form data to create a settings object
  // get the taxRate
  let taxRate = el.taxRateInput.value;
  taxRate = Number(taxRate);
  // fontsize radio code
  const fontSizeValue = getRadioValue(el.settingsForm, "fontSize");
  const settingsStorage = new SettingsStorage();
  const settingsObj = new SettingsObj();
  // set the object values
  settingsObj.taxRate = taxRate;
  settingsObj.fontSize = fontSizeValue;
  settingsObj.filePathArray = settingsArrayContainer;
  // set auto load true or false
  settingsObj.autoLoad = el.autoLoadCheckBox.checked;
  // save the object
  settingsStorage.saveSettings(settingsObj);
  addAudio.play();
  // reset form
  el.settingsForm.reset();
  if (settingsObj.autoLoad) {
    // clear two arrays
    // setting the length to Zero emptys the array
    arrayOfYearObjs.length = 0;
    settingsArrayContainer.length = 0;
    display.displayNone(el.settingsForm);
    startUp();
  } else {
    // let settings = settingsStorage.getSettingsFromFile();
    applySettings(settingsObj);
    // hide form
    display.displayNone(el.settingsForm);
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
}); // End

// when You click on settings form cancel Btn
el.settingsCancelBtn.addEventListener("click", (e) => {
  cancelAudio.play();
  // hide form
  display.displayNone(el.settingsForm);
  display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
  return;
});

// when You click on settings form factory reset btn
el.factoryResetBtn.addEventListener("click", (e) => {
  btnAudio.play();
  const settingsStorage = new SettingsStorage();
  settingsStorage.clearFileFromLocalStorage();
  loadUpSettingsForm();
});

// When You click on settings form add path to autoload Btn
el.settingsAddPathBtn.addEventListener("click", async (e) => {
  // addImageAudio.play();
  window.api.showOpenDialog();
});

// responding api
window.api.handleAuotLoadPaths((event, fileNames) => {
  if (!fileNames) {
    display.showAlert("Bad file names.", "error", 1500);
    return;
  }
  // push into array of paths
  for (const filePath of fileNames) {
    if (settingsArrayContainer.includes(filePath)) {
      continue;
    } else {
      settingsArrayContainer.push(filePath);
    }
  }
  addImageAudio.play();
  display.showAutoLoadList(settingsArrayContainer);
});

// when You click on x to delete a file path
el.autoLoadList.addEventListener("click", (e) => {
  // event delegation
  if (e.target.classList.contains("deleteFile")) {
    if (!e.ctrlKey) {
      wrongAudio.play();
      display.showAlert(
        "You have to hold down ctrl key to make a deletion",
        "error"
      );
      return;
    }

    //check if control was down, if so delete
    if (e.ctrlKey) {
      // this gets the data I embedded into the html
      let dataIndex = e.target.parentElement.parentElement.dataset.index;
      let deleteIndex = parseInt(dataIndex);
      if (isNaN(deleteIndex)) {
        return;
      }
      // delete path
      settingsArrayContainer.splice(deleteIndex, 1);
      warningSelectAudio.play();
      // update Form
      display.showAutoLoadList(settingsArrayContainer);
    }
  }
});

// *************************************************************
//  End Settings Code
// *************************************************************
// window api's #################################################################
const saveYear = (year) => {
  window.api.saveYear(year);
}; //End saveYear

window.api.handleFontSizeChange((event, fontSize) => {
  switch (fontSize) {
    case "x-small":
      el.root.style.fontSize = "10px";
      break;
    case "small":
      el.root.style.fontSize = "12px";
      break;
    case "normal":
      el.root.style.fontSize = "16px";
      break;
    case "large":
      el.root.style.fontSize = "20px";
      break;
    case "x-large":
      el.root.style.fontSize = "24px";
      break;
    default:
      console.log("No valid font-size");
  }
});

window.api.handleOpenFile((event, data) => {
  let isTaken = false;

  for (const element of arrayOfYearObjs) {
    if (element.fileNamePath === data.fileNamePath) {
      isTaken = true;
    }
  }
  if (isTaken) {
    display.showAlert("That file is already loaded!", "error");
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  // create a year object
  const newYear = new YearObject(
    data.name,
    data.fileNamePath,
    data.arrayOfMonthObjects
  );
  // push the year obj into the array of year Objects
  arrayOfYearObjs.push(newYear);
  sortArrayByName(arrayOfYearObjs);
  // write the year object to disk
  // newYear.writeYearToHardDisk(fs, display);
  // saveYear(arrayOfYearObjs[yearIndex]);
  saveYear(data);
  display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
  return;
});

window.api.handleShowAlert((event, { message, msgType }) => {
  display.showAlert(message, msgType);
});
window.api.handleShowSettingsForm((event, noData) => {
  loadUpSettingsForm();
  display.showSettingsForm();
});
// responding api
window.api.handleAuotLoadPaths((event, fileNames) => {
  if (!fileNames) {
    display.showAlert("Bad file names.", "error", 1500);
    return;
  }
  // push into array of paths
  for (const filePath of fileNames) {
    if (settingsArrayContainer.includes(filePath)) {
      continue;
    } else {
      settingsArrayContainer.push(filePath);
    }
  }
  addImageAudio.play();
  display.showAutoLoadList(settingsArrayContainer);
});
