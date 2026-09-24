import { useCallback, useEffect, useState } from "react";
import { db } from "@/integrations/supabase/db";
import { useAuth } from "@/hooks/useAuth";
import type { CustomerProfile } from "@/types/customer";

export const useProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await db
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      setError("Não foi possível carregar seus dados cadastrais.");
      setLoading(false);
      return;
    }

    if (!data) {
      // fallback: garante que o perfil exista para contas antigas
      const { data: created } = await db
        .from("profiles")
        .insert({ id: user.id, name: user.user_metadata?.name ?? null })
        .select("*")
        .maybeSingle();
      setProfile((created as CustomerProfile) ?? null);
    } else {
      setProfile(data as CustomerProfile);
    }
    setError(null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  const save = async (values: Partial<CustomerProfile>) => {
    if (!user) return { error: "Você precisa estar conectado." };
    const { error } = await db.from("profiles").update(values).eq("id", user.id);
    if (error) return { error: "Não foi possível salvar as alterações." };
    await load();
    return { error: null };
  };

  return { profile, loading: loading || authLoading, error, save, reload: load };
};
