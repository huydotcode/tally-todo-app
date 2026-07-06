import { ITaskRepository } from "./types";
import { LocalStorageTaskRepository } from "./localStorageTaskRepository";
import { SupabaseTaskRepository } from "./supabaseTaskRepository";
import { supabase } from "../supabase/client";

export class RepositoryFactory {
  private static localStorageRepository = new LocalStorageTaskRepository();
  private static supabaseRepository = new SupabaseTaskRepository();

  static async getRepository(): Promise<ITaskRepository> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        return this.supabaseRepository;
      }
    } catch (e) {
      console.warn("Failed to check Supabase session, falling back to LocalStorage:", e);
    }
    return this.localStorageRepository;
  }
}
