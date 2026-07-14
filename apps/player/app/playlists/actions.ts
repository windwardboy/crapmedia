"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/settings?next=/playlists");
  }

  return { supabase, userId: user.id };
}

export async function createPlaylist(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return;
  }

  const { supabase, userId } = await requireUserId();

  const { data, error } = await supabase
    .from("playlists")
    .insert({ user_id: userId, name })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/playlists");
  redirect(`/playlists/${data.id}`);
}

export async function updatePlaylist(playlistId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) {
    return;
  }

  const { supabase, userId } = await requireUserId();

  const { error } = await supabase
    .from("playlists")
    .update({
      name,
      description: description || null,
    })
    .eq("id", playlistId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/playlists");
  revalidatePath(`/playlists/${playlistId}`);
}

export async function deletePlaylist(playlistId: string) {
  const { supabase, userId } = await requireUserId();

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/playlists");
  redirect("/playlists");
}

export async function setDrivingDefault(playlistId: string, enabled: boolean) {
  const { supabase, userId } = await requireUserId();

  if (enabled) {
    await supabase
      .from("playlists")
      .update({ is_driving_default: false })
      .eq("user_id", userId);
  }

  const { error } = await supabase
    .from("playlists")
    .update({ is_driving_default: enabled })
    .eq("id", playlistId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/playlists");
  revalidatePath(`/playlists/${playlistId}`);
}
