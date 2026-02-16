import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { stations as mockStations, ndlsFacilities, ndlsTrains } from "@/data/mockData";
import type { Station, Facility, Train } from "@/data/mockData";

export function useStations() {
  return useQuery({
    queryKey: ["stations"],
    queryFn: async (): Promise<Station[]> => {
      const { data, error } = await supabase
        .from("stations")
        .select("id, code, name, city, lat, lng");
      if (error || !data || data.length === 0) return mockStations;
      return data.map((s) => ({
        id: s.code.toLowerCase(),
        name: s.name,
        code: s.code,
        lat: s.lat,
        lng: s.lng,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useFacilities(stationCode: string) {
  return useQuery({
    queryKey: ["facilities", stationCode],
    queryFn: async (): Promise<Facility[]> => {
      const { data: stationData } = await supabase
        .from("stations")
        .select("id")
        .eq("code", stationCode.toUpperCase())
        .single();

      if (!stationData) return ndlsFacilities;

      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .eq("station_id", stationData.id);

      if (error || !data || data.length === 0) return ndlsFacilities;

      return data.map((f) => ({
        id: f.id,
        name: f.name,
        type: f.type as Facility["type"],
        lat: f.lat,
        lng: f.lng,
        description: f.description || "",
        crowdLevel: f.crowd_level as Facility["crowdLevel"],
        accessible: f.accessible,
        floor: 0,
      }));
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useTrainSchedules(stationCode: string) {
  return useQuery({
    queryKey: ["train_schedules", stationCode],
    queryFn: async (): Promise<Train[]> => {
      const { data: stationData } = await supabase
        .from("stations")
        .select("id")
        .eq("code", stationCode.toUpperCase())
        .single();

      if (!stationData) return ndlsTrains;

      const { data, error } = await supabase
        .from("train_schedules")
        .select("*")
        .eq("station_id", stationData.id);

      if (error || !data || data.length === 0) return ndlsTrains;

      return data.map((t) => ({
        number: t.train_no,
        name: t.train_name,
        platform: t.platform || 0,
        arrival: t.arrival || "--",
        departure: t.departure || "--",
        delay: t.delay_minutes,
        status: t.status as Train["status"],
      }));
    },
    staleTime: 60 * 1000,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: {
      facility_id: string;
      user_id: string;
      rating: number;
      tags: string[];
      comment?: string;
    }) => {
      const { error } = await supabase.from("reviews").insert(review);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
  });
}
