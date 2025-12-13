"use client";

import { useState } from "react";
import { Sidebar, SIDEBAR_WIDTH } from "@components/Organization/Sidebar";
import { EventEditDialog } from "@components/Organization/EventEditDialog";
import { DeleteEventDialog } from "@components/Organization/EventDeleteDialog";
import { QuickActionButton } from "@components/Organization/QuickActionButton";
import { PlusIcon } from "lucide-react";


export default function EventsPage() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("edit");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <Sidebar />

      <main
        className="flex-1 min-h-screen px-6 py-8 md:px-10"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="font-outfit font-semibold text-2xl text-[#0e1f35]">
                Event Management
              </h1>
              <p className="font-outfit text-sm text-gray-500 mt-1">
                Manage, edit, and track your posted events.
              </p>
            </div>

            <QuickActionButton
              href="#"
              icon={PlusIcon}
              label="Create Event"
              variant="primary"
              onClickOverride={() => {
                setEditMode("create");
                setIsEditOpen(true);
              }}
            />
          </div>

          {/* Placeholder for the cards/table/etc. */}
          <div className="rounded-xl bg-white shadow-md p-6 text-center text-gray-400 font-outfit text-sm">
            Event Management content goes here (cards / table / filters).
            <br />
            Hook your Edit buttons to{" "}
            <code>setEditMode("edit"); setIsEditOpen(true);</code>
            <br />
            Hook Delete buttons to <code>setIsDeleteOpen(true);</code>
          </div>
        </div>
      </main>

      <EventEditDialog
        open={isEditOpen}
        mode={editMode}
        onClose={() => setIsEditOpen(false)}
      />

      <DeleteEventDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
