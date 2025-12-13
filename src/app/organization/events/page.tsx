"use client";

<<<<<<< HEAD
import { Sidebar, SIDEBAR_WIDTH } from "@components/Organization/Sidebar";
=======
import { useState } from "react";
import { Sidebar, SIDEBAR_WIDTH } from "@components/organization/Sidebar";
import { EventEditDialog } from "@components/organization/EventEditDialog";
import { DeleteEventDialog } from "@components/organization/EventDeleteDialog";
import { QuickActionButton } from "@components/organization/QuickActionButton";
import { PlusIcon } from "lucide-react";

export default function EventsPage() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("edit");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
>>>>>>> 547311cd0a17d16eb5e4b5514232deef031fe2ec

export default function OrganizationEventsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 md:p-8 md:ml-[280px] pt-16 md:pt-8">
        <h1 className="font-outfit font-semibold text-[#1e4e79] text-4xl mb-8">
          Events
        </h1>
        <p className="font-outfit text-[#1e4e79] text-lg">
          To be implemented
        </p>
      </div>
    </div>
  );
}