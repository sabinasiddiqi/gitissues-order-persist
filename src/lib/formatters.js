export const formatDate = (ts) => {
  var parts = ts.split("T")[0].split("-")
  return parts.reverse().join("/")
}
