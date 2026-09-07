import { useQuery } from "@tanstack/react-query";
import {
  getTechnologies,
  Technology,
} from "../../api/services/technology.service";

export function useTechnologies() {
  return useQuery<Technology[]>({
    queryKey: ["technologies"],
    queryFn: getTechnologies,
  });
}
