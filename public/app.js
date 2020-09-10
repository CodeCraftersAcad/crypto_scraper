// fetching data using .then()
// fetch("/api")
//   .then(response => response.json())
//   .then(data => console.log(data.cleaned))
//   .catch(err => console.log(err));

// function to grab data from server
const getDataFromServer = async (url) => {
  // fetch data using async await
  // fetch returns strigified data
  const fetchedData = await fetch(url);
  // turn stringified data to a json object
  const response = await fetchedData.json();
  // grabs the "cleaned" array of objects
  const data = response.cleaned;
  // table setup
  // grab thead and tbody
  const thead = document.querySelector('thead');
  const tbody = document.querySelector('tbody');
  // setting up thead using innerHTML
  thead.innerHTML = `
    <th scope="col">NAME</th>
    <th scope="col">PRICE</th>
    <th scope="col">CHANGE</th>
    <th scope="col">CHANGE %</th>
    <th scope="col">MKT. CAP</th>
  `;
  // mapping through cleaned data object
  data.map(d => {
    // using += here so for each loop a new <tr></tr> is attached to the document
    tbody.innerHTML += `
      <tr>
        <td>${d.name} (${d.abbr.split("-")[0]})</td>
        <!-- using ternary operator to dynamically render color for each row -->
        <td class=${d.change.charAt(0) === "+" ? "up" : "down"}>${d.cost}</td>
        <td class=${d.change.charAt(0) === "+" ? "up" : "down"}>${d.change}</td>
        <td class=${d.change.charAt(0) === "+" ? "up" : "down"}>${d.per_change}</td>
        <td>${d.cap}</td>
        </tr>
    `
  })
}
// calling our function on the api route specified on the server
getDataFromServer("/api")