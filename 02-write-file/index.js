const { stdin, stdout } = process;
const fs = require("fs");
const path = require("path");
const output = fs.createWriteStream(path.join(__dirname, "output.txt"));
stdout.write("Hello, Stranger! Please, enter whatever you want.\n");
stdin.on("data", (data) => {
  if (data.toString().trim() === "exit") {
    farewell();
  }
  output.write(data);
})

process.on("SIGINT", farewell);

function farewell() {
  console.log("Good luck, Stranger!");
  process.exit();
}
