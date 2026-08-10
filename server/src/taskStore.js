import { supabase } from "./supabaseClient.js";

const TABLE = "tasks";

function toApiTask(row) {
  return {
    id: row.id,
    title: row.text,
    completed: row.completed,
    createdAt: row.created_at,
  };
}

export async function getAllTasks(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data.map(toApiTask);
}

export async function createTask({ title, userId }) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ text: title, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return toApiTask(data);
}

export async function updateTask(id, updates, userId) {
  const dbUpdates = {};
  if (updates.title !== undefined) dbUpdates.text = updates.title;
  if (updates.completed !== undefined) dbUpdates.completed = updates.completed;

  const { data, error } = await supabase
    .from(TABLE)
    .update(dbUpdates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? toApiTask(data) : null;
}

export async function deleteTask(id, userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}
