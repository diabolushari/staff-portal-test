import { router } from "@inertiajs/react";
import { Clock, Settings } from "lucide-react";
import { useState } from "react";
import { meterNavItems, meterTimezoneNavItems } from '@/components/Navbar/navitems'
import MainLayout from "@/layouts/main-layout";
import CardHeader from "@/ui/Card/CardHeader";
import ListSearch from "@/ui/Search/ListSearch";

export interface MeteringTimezone {
  version_id: number;
  metering_timezone_id: number;
  pricing_type: { id: number; parameter_value: string };
  timezone_type: { id: number; parameter_value: string };
  timezone_name: { id: number; parameter_value: string };
  from_hrs: number;
  from_mins: number;
  to_hrs: number;
  to_mins: number;
  effective_start_ts: string;
  effective_end_ts: string | null;
  is_active: boolean;
  created_ts: string;
  updated_ts: string;
  created_by: number;
  updated_by: number | null;
}

interface Props {
  timezones: {
    data?: MeteringTimezone[];
  } | MeteringTimezone[];
}

export default function MeteringTimezonesIndexPage({ timezones }: Props) {
  // Handle both array and object with data property
  const timezonesData = Array.isArray(timezones) ? timezones : timezones?.data || [];
  const [items, setItems] = useState<MeteringTimezone[]>(timezonesData);

  function handleShow(id: number) {
    router.get(`/metering-timezone/${id}`);
  }

  function formatTime(hrs: number, mins: number): string {
    const formattedHrs = hrs.toString().padStart(2, '0');
    const formattedMins = mins.toString().padStart(2, '0');
    return `${formattedHrs}:${formattedMins}`;
  }

  return (
    <MainLayout navItems={meterTimezoneNavItems}>
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <ListSearch
          title="Metering Timezones search"
          placeholder="Enter timezone name"
          // url={route("metering-timezones.index")}
        />

        <div className="relative w-full rounded-lg bg-white">
          <CardHeader title="Metering Timezones" />

          <div className="flex flex-col px-7 pb-7">
            {items && items.length > 0 ? (
              items.map((timezone) => (
                <div
                  key={timezone.metering_timezone_id}
                  onClick={() => handleShow(timezone.metering_timezone_id)}
                  className="mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    {/* Left side info */}
                    <div className="flex flex-1 flex-col gap-2 p-[10px]">
                      {/* Timezone Name */}
                      <div className="font-inter text-base font-semibold text-black">
                        {timezone.timezone_name.parameter_value}
                      </div>

                      {/* Time Range */}
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        {formatTime(timezone.from_hrs, timezone.from_mins)} - {formatTime(timezone.to_hrs, timezone.to_mins)}
                      </div>

                      {/* Pricing Type + Timezone Type */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Settings className="h-3.5 w-3.5 text-slate-500" />
                          {timezone.pricing_type.parameter_value}
                        </div>
                        <div className="text-slate-400">•</div>
                        <div>
                          {timezone.timezone_type.parameter_value}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500">
                <p>No metering timezones found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
