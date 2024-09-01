import axios from "axios";

export const getAll = async () => {
  const { data } = await axios.get("/api/tickets");
  return data;
};

export const search = async (searchTerm) => {
  const { data } = await axios.get("/api/tickets/search/" + searchTerm);
  return data;
};

export const getAllTags = async () => {
  const { data } = await axios.get("/api/tickets/tags");
  return data;
};

export const getAllByTag = async (tag) => {
  if (tag === "All") return getAll();
  const { data } = await axios.get("/api/tickets/tag/" + tag);
  return data;
};

export const getById = async (ticketId) => {
  const { data } = await axios.get("/api/tickets/" + ticketId);
  return data;
};

export async function deleteById(ticketId) {
  await axios.delete("/api/tickets/" + ticketId);
}

export async function update(ticket) {
  await axios.put("/api/tickets", ticket);
}

export async function add(ticket) {
  const { data } = await axios.post("/api/tickets", ticket);
  return data;
}
