const express = require('express'),
  app = express(),
  path = require('path'),
  axios = require('axios'),
  cheerio = require('cheerio'),
  PORT = process.env.PORT || 3000;

// showing what each package does seperately
// const responseData = async () => {
//   //show what just axios returns
//   const axiosObj = await axios.get("https://finance.yahoo.com/cryptocurrencies");
//   // console.log(axiosObj);
//   // shows cheerio response object from cheerio load method
//   const cherrioObj = cheerio.load(axiosObj.data);
//   // console.log(cherrioObj);
//   // show html
//   const cd = await cherrioObj;
//   // console.log(cd("body").html());
// }
// responseData();

// fectch data all in one function 
const fetchData = async (url) => {
  let result = await axios.get(url);
  return cheerio.load(result.data);
}

// express middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// api route
app.get("/api", async (req, res) => {
  // empty array to push cherrio data to
  const data = [];
  // using fetchData function to pull reponse object from url
  const cd = await fetchData("https://finance.yahoo.com/cryptocurrencies");
  // cheerio syntax to find td html
  cd("body").find("#scr-res-table > div > table > tbody > tr > td").each((i, elem) => {
    const stockInfo = cd(elem).text()
    // we want to push each piece of stockinfo to an array
    data.push(stockInfo);
  });
  // console log this and see what returns
  const joined = data.join(" ").split("  ");
  // console log this and see what returns
  const filtered = joined.filter(d => {
    // ==================== if data isn't empty or trash =======
    if (d !== "" && d !== undefined && d.trim().split(" ")[0] !== "BAT-USD" && d !== null) {
      // ================== object to return ===================
      return d;
    }
  });
  // mapping through joined data to split into single elements
  const cleaned = filtered.map(d => {
    return {
      // setting single elements to properties in an object
      abbr: d.trim().split(" ")[0],
      name: d.trim().split(" ")[1],
      // data below here is pushed back because of the names of some of the companies
      // so we use ternary operators to find data at each split 
      // if data is equal to what we need we grab the data at that position
      // else we grab data at another position
      cost: d.trim().split(" ")[3] === "USD" || d.trim().split(" ")[3] === "Token" ? d.trim().split(" ")[4] : d.trim().split(" ")[3],
      change: d.trim().split(" ")[4].charAt(0) === "+" || d.trim().split(" ")[4].charAt(0) === "-" ? d.trim().split(" ")[4] : d.trim().split(" ")[5],
      per_change: d.trim().split(" ")[5].charAt(d.trim().split(" ")[5].length - 1) === "%" ? d.trim().split(" ")[5] : d.trim().split(" ")[6],
      cap: d.trim().split(" ")[6].charAt(d.trim().split(" ")[6].length - 1) === "%" ? d.trim().split(" ")[7] : d.trim().split(" ")[6],
    }
  })
  res.json({
    // raw data
    data,
    // data split into long sentences
    joined,
    // filtered does not include 'BAT-USD'
    filtered,
    // final cleaned data
    cleaned
  })
})
// a route to check if server is still up
app.get("/config", (req, res) => {
  res.json({
    status: "Server up"
  })
});

// route to show html page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
})

// listen method
app.listen(PORT, () => {
  console.log(`SERVER UP http://localhost:${PORT}`)
})