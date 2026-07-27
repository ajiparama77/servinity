"use client";

import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";

export default function AppointmentsPage() {
  return (
    <div className="h-full min-h-[600px] bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <FullCalendar
        plugins={[resourceTimelinePlugin, interactionPlugin]}
        initialView="resourceTimelineDay"
        resources={[
          { id: "a", title: "Stylist A" },
          { id: "b", title: "Stylist B" },
          { id: "c", title: "Stylist C" },
        ]}
        events={[
          { id: "1", resourceId: "a", title: "Haircut", start: new Date().toISOString().split('T')[0] + "T10:00:00", end: new Date().toISOString().split('T')[0] + "T11:00:00" },
          { id: "2", resourceId: "b", title: "Coloring", start: new Date().toISOString().split('T')[0] + "T13:00:00", end: new Date().toISOString().split('T')[0] + "T15:00:00" },
        ]}
        height="100%"
        headerToolbar={{
          left: 'today prev,next',
          center: 'title',
          right: 'resourceTimelineDay,resourceTimelineWeek'
        }}
        slotMinTime="08:00:00"
        slotMaxTime="21:00:00"
      />
    </div>
  );
}
