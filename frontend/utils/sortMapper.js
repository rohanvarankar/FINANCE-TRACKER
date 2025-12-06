export function mapSort(filters) {
  const { sort, order } = filters;

  // Amount sorting
  if (sort === "amount") {
    return order === "asc" ? "low" : "high";
  }

  // Date sorting
  if (sort === "date") {
    return order === "asc" ? "oldest" : "latest";
  }

  // Type sorting
  if (sort === "type") {
    return order === "asc" ? "typeAsc" : "typeDesc";
  }

  return "latest"; // default for backend
}
