module.exports.getDate = getDate;

function getDate() {
  const date = new Date();

  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  const result = date.toLocaleDateString("en-US", options);

  return result;
}
