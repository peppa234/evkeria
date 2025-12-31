"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { XIcon, PencilIcon, Loader2, ImageIcon, Bold, Italic, Link as LinkIcon, List } from "lucide-react";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from "@lib/constants";

interface EventData {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  registrationDeadline: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  status: "Upcoming" | "Active" | "Past";
  maxAttendees: number | "";
  price: number | "";
  applicationLink: string;
}

const defaultEventData: EventData = {
  title: "",
  description: "",
  imageUrl: "",
  date: "",
  registrationDeadline: "",
  startTime: "",
  endTime: "",
  location: "",
  category: "Technology",
  status: "Upcoming",
  maxAttendees: "",
  price: "",
  applicationLink: "",
};

interface EventEditDialogProps {
  open: boolean;
  mode: "create" | "edit";
  event?: EventData | null;
  organizationId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function EventEditDialog({
  open,
  mode,
  event,
  organizationId,
  onClose,
  onSuccess,
}: EventEditDialogProps) {
  const [formData, setFormData] = useState<EventData>(defaultEventData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Markdown toolbar functions
  const wrapSelectedText = (before: string, after: string) => {
    const textarea = descriptionTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.description.substring(start, end);
    
    const newText = formData.description.substring(0, start) + before + selectedText + after + formData.description.substring(end);
    setFormData((prev) => ({ ...prev, description: newText }));

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const insertLink = () => {
    const textarea = descriptionTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.description.substring(start, end);
    
    const linkText = selectedText || "link text";
    const newText = formData.description.substring(0, start) + `[${linkText}](url)` + formData.description.substring(end);
    setFormData((prev) => ({ ...prev, description: newText }));

    setTimeout(() => {
      textarea.focus();
      // Select "url" so user can type the actual URL
      const urlStart = start + linkText.length + 3;
      textarea.setSelectionRange(urlStart, urlStart + 3);
    }, 0);
  };

  const insertList = () => {
    const textarea = descriptionTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = formData.description.substring(0, start) + "\n- " + formData.description.substring(start);
    setFormData((prev) => ({ ...prev, description: newText }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 3, start + 3);
    }, 0);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      if (mode === "edit" && event) {
        setFormData({
          ...event,
          date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
          registrationDeadline: event.registrationDeadline
            ? new Date(event.registrationDeadline).toISOString().split("T")[0]
            : "",
        });
      } else {
        setFormData(defaultEventData);
      }
      setError(null);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mode, event]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setError(null);

    // Validate file type
    if (!file.type || !file.type.startsWith('image/')) {
      setError('Invalid file type. Please select an image file (JPEG, PNG, GIF, WebP, or SVG).');
      e.target.value = ''; // Clear the input
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
      setError(`File too large (${fileSizeMB}MB). Maximum size is ${MAX_FILE_SIZE_MB}MB. Please choose a smaller image.`);
      e.target.value = ''; // Clear the input
      return;
    }

    setIsUploading(true);
    setError(null); // Clear any previous errors

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("type", "event");
      formDataUpload.append("entityId", event?.id || organizationId);

      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formDataUpload,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Standardized format: { success: false, error: { message: string } }
        const errorMsg = data.error?.message || `Upload failed with status ${res.status}`;
        throw new Error(errorMsg);
      }

      // Standardized format: { success: true, data: { url: string } }
      if (data.success && data.data?.url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.data.url }));
        setError(null); // Clear error on success
      } else {
        throw new Error("Upload succeeded but no URL returned");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert date strings to ISO datetime strings for validation
      // Date input gives YYYY-MM-DD, we need to convert to ISO datetime
      const dateISO = formData.date 
        ? new Date(formData.date + 'T00:00:00.000Z').toISOString() 
        : "";
      
      const registrationDeadlineISO = formData.registrationDeadline
        ? new Date(formData.registrationDeadline + 'T00:00:00.000Z').toISOString()
        : null;

      interface EventPayload {
        title: string;
        description?: string;
        imageUrl?: string;
        date: string;
        registrationDeadline?: string | null;
        category: string;
        status: string;
        price: number;
        startTime?: string;
        endTime?: string;
        location?: string;
        maxAttendees?: number;
        applicationLink?: string;
      }

      const payload: EventPayload = {
        title: formData.title,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
        date: dateISO,
        registrationDeadline: registrationDeadlineISO,
        category: formData.category,
        status: formData.status,
        price: formData.price ? Number(formData.price) : 0,
      };

      // Only include optional fields if they have values
      if (formData.startTime) payload.startTime = formData.startTime;
      if (formData.endTime) payload.endTime = formData.endTime;
      if (formData.location) payload.location = formData.location;
      if (formData.maxAttendees) payload.maxAttendees = Number(formData.maxAttendees);
      if (formData.applicationLink) payload.applicationLink = formData.applicationLink;

      let res: Response;

      if (mode === "create") {
        res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/events/${event?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        // Standardized format: { success: false, error: { message: string, details?: [...] } }
        let errorMsg = data.error?.message || "Failed to save event";
        
        // If there are validation details, include them in the error message
        if (data.error?.details && Array.isArray(data.error.details)) {
          interface ValidationIssue {
            path?: (string | number)[];
            message?: string;
          }
          const validationErrors = (data.error.details as ValidationIssue[])
            .map((issue) => `${issue.path?.join('.') || 'field'}: ${issue.message || 'Invalid'}`)
            .join(', ');
          errorMsg = `${errorMsg} (${validationErrors})`;
        }
        
        throw new Error(errorMsg);
      }
      
      const data = await res.json();
      // Check success even if res.ok
      if (!data.success) {
        const errorMsg = data.error?.message || "Failed to save event";
        throw new Error(errorMsg);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  const title = mode === "edit" ? "Edit Event" : "Create Event";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-[900px] max-w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 z-10"
          aria-label="Close dialog"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="px-6 sm:px-10 pt-8 pb-6">
          <h2 className="font-outfit font-semibold text-2xl text-[#0e1f35] mb-6">
            {title}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Event Name *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                  placeholder="Enter event name"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Application Link
                </label>
                <input
                  name="applicationLink"
                  value={formData.applicationLink}
                  onChange={handleChange}
                  type="url"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                  placeholder="https://forms.google.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-outfit text-sm text-gray-600">
                Description
              </label>
              {/* Markdown Toolbar */}
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-t-lg border border-gray-200 border-b-0">
                <button
                  type="button"
                  onClick={() => wrapSelectedText("**", "**")}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Bold (select text first)"
                >
                  <Bold size={16} className="text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => wrapSelectedText("*", "*")}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Italic (select text first)"
                >
                  <Italic size={16} className="text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={insertLink}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Insert link"
                >
                  <LinkIcon size={16} className="text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={insertList}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Insert list"
                >
                  <List size={16} className="text-gray-600" />
                </button>
                <span className="ml-auto text-xs text-gray-400 pr-2">
                  Select text, then click to format
                </span>
              </div>
              <textarea
                ref={descriptionTextareaRef}
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-b-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] resize-none"
                placeholder="Write your description here... (Markdown supported)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Event Date *
                </label>
                <input
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  type="date"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Registration Deadline
                </label>
                <input
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  type="date"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Start Time
                </label>
                <input
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  type="time"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  End Time
                </label>
                <input
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  type="time"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Location
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                  placeholder="Event location"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit bg-white focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                >
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit bg-white focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Active">Active</option>
                  <option value="Past">Past</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Max Attendees
                </label>
                <input
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                  placeholder="Max"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Price ($)
                </label>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                  placeholder="0 for free"
                />
              </div>
            </div>

            {/* Event Image */}
            <div className="space-y-2">
              <label className="block font-outfit text-sm text-gray-600">
                Event Image
              </label>
              <div className="relative overflow-hidden rounded-xl h-[140px] bg-gray-100">
                {formData.imageUrl ? (
                  <Image
                    src={formData.imageUrl}
                    alt="Event banner"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}

                <input
                  id="event-image-input"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => document.getElementById("event-image-input")?.click()}
                  className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow z-10 hover:bg-gray-50 disabled:opacity-50"
                  aria-label="Change event image"
                >
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 text-[#4fa3e3] animate-spin" />
                  ) : (
                    <PencilIcon className="w-5 h-5 text-[#4fa3e3]" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-[48px] px-8 rounded-full border border-gray-300 font-outfit font-medium text-sm text-[#0e1f35] bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-[48px] px-10 rounded-full bg-[#4fa3e3] text-white font-outfit font-semibold text-sm hover:bg-[#4fa3e3]/90 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "create" ? "Create Event" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
