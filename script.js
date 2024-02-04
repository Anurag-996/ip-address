let ipaddress;

function getIp() {
  $.getJSON("https://ipinfo.io")
    .done(function (data) {
      ipaddress = data.ip;
      displayIp(ipaddress, "ip-address");
      console.log(`Your Current IP Address is ${ipaddress}`);
    })
    .fail(function (textStatus, errorThrown) {
      console.log("Error:", textStatus, errorThrown);
    });
}

function displayIp(ip, id) {
  let ipCon = document.getElementById(id);
  ipCon.innerText = ip;
}

$(document).ready(function () {
  getIp();
});

let getDataBtn = document.getElementById("btn-get");
getDataBtn.addEventListener("click", displayData);

function displayData() {
  (() => {
    let getDataPage = document.getElementById("first-page");
    let displayDataPage = document.getElementById("second-page");

    getDataPage.classList.add("display-none");
    displayDataPage.removeAttribute("class");
  })();

  displayIp(ipaddress, "ip");
  getLocationInfo(ipaddress);
}

async function getLocationInfo(ip) {
  const url = `https://ipapi.co/${ip}/json/`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayInfo(data);
      displayMap(data.latitude, data.longitude);
      let dateTime = getTimeZone(data.timezone);

      document.getElementById("time-zone").innerHTML = data.timezone;
      document.getElementById("date-time").innerHTML = dateTime;
      document.getElementById("pincode").innerHTML = data.postal;
      displayPostDetail(data.postal);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function displayInfo(data) {
  let lat = document.getElementById("lat");
  let city = document.getElementById("city");
  let org = document.getElementById("organization");
  let lon = document.getElementById("long");
  let region = document.getElementById("region");

  lat.innerHTML = data.latitude;
  city.innerHTML = data.city;
  org.innerHTML = data.org;
  lon.innerHTML = data.longitude;
  region.innerHTML = data.region;
}

function displayMap(lat, lon) {
  document
    .getElementById("map-frame")
    .setAttribute(
      "src",
      `https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`
    );
}

function getTimeZone(zone) {
  return new Date().toLocaleString("en-US", {
    timeZone: `${zone}`,
  });
}

function displayPostDetail(pincode) {
  const url = `https://api.postalpincode.in/pincode/${pincode}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let mes = document.getElementById("message");
      mes.textContent = `${data[0].Message}`;
      arr = data[0].PostOffice;
      arr.map(createPostbox);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function createPostbox(ele) {
  let con = document.createElement("div");
  con.classList.add("postal-box");

  con.innerHTML = `
                        <p>Name: ${ele.Name}</p>
                        <p>Branch Type: ${ele.BranchType}</p>
                        <p>Delivery Status: ${ele.DeliveryStatus}</p>
                        <p>District: ${ele.District}</p>
                        <p>Division: ${ele.Division}</p>`;

  par = document.getElementsByClassName("postal-display")[0];
  par.append(con);
}

const searchBox = document.getElementById("filter-search");
searchBox.addEventListener("input", searchPostalOffices);

function searchPostalOffices() {
  const searchTerm = searchBox.value.toLowerCase();

  const filteredArr = arr.filter(
    (item) =>
      item.Name.toLowerCase().includes(searchTerm) ||
      item.BranchType.toLowerCase().includes(searchTerm)
  );

  const postalDisplay = document.getElementsByClassName("postal-display")[0];
  postalDisplay.innerHTML = "";

  filteredArr.forEach(createPostbox);
}
