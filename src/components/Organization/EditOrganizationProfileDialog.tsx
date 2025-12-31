"use client";

import { FormEvent, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useOrganizationAuth } from "@context/OrganizationAuthContext";
import { Loader2, Bold, Italic, Link as LinkIcon, List } from "lucide-react";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from "@lib/constants";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function EditOrganizationProfileDialog({ isOpen, onClose }: Props) {
  const { organization, updateOrganization, refreshOrganization } = useOrganizationAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState<string>("/logo_white.svg");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; websiteUrl?: string; general?: string; logo?: string }>({});

  // Validation functions
  const validateEmail = (value: string): string | undefined => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  const validateUrl = (value: string): string | undefined => {
    if (!value) return undefined; // Optional field
    try {
      const url = new URL(value);
      if (!["http:", "https:"].includes(url.protocol)) {
        return "URL must start with http:// or https://";
      }
      return undefined;
    } catch {
      return "Please enter a valid URL (e.g., https://yoursite.com)";
    }
  };

  const descriptionTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Markdown toolbar functions
  const wrapSelectedText = (before: string, after: string) => {
    const textarea = descriptionTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end);
    
    const newText = description.substring(0, start) + before + selectedText + after + description.substring(end);
    setDescription(newText);

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
    const selectedText = description.substring(start, end);
    
    const linkText = selectedText || "link text";
    const newText = description.substring(0, start) + `[${linkText}](url)` + description.substring(end);
    setDescription(newText);

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
    const newText = description.substring(0, start) + "\n- " + description.substring(start);
    setDescription(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 3, start + 3);
    }, 0);
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && organization) {
      setName(organization.name || "");
      setEmail(organization.email || "");
      setType(organization.type || "");
      setDescription(organization.description || "");
      setWebsiteUrl(organization.websiteUrl || "");
      setLogoUrl(organization.logoUrl || "/logo_white.svg");
      setLogoFile(null);
      setErrors({});
    }
    
    // Cleanup: revoke any blob URLs when dialog closes
    return () => {
      if (logoUrl && logoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [isOpen, organization]);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Clear previous errors
    setErrors((prev) => ({ ...prev, logo: undefined, general: undefined }));
    
    // Validate file type
    if (!file.type || !file.type.startsWith('image/')) {
      setErrors((prev) => ({ 
        ...prev, 
        logo: 'Invalid file type. Please select an image file (JPEG, PNG, GIF, WebP, or SVG).' 
      }));
      e.target.value = ''; // Clear the input
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
      setErrors((prev) => ({ 
        ...prev, 
        logo: `File too large (${fileSizeMB}MB). Maximum size is ${MAX_FILE_SIZE_MB}MB. Please choose a smaller image.` 
      }));
      e.target.value = ''; // Clear the input
      return;
    }
    
    // Revoke previous blob URL if it exists
    if (logoUrl && logoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(logoUrl);
    }
    
    setLogoFile(file);
    // Create preview URL
    const url = URL.createObjectURL(file);
    setLogoUrl(url);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate
    const emailError = validateEmail(email);
    const urlError = websiteUrl ? validateUrl(websiteUrl) : undefined;

    if (emailError || urlError) {
      setErrors({
        email: emailError,
        websiteUrl: urlError,
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (!organization?.id) {
        setErrors({ general: "Organization not found. Please refresh the page." });
        setIsLoading(false);
        return;
      }

      let finalLogoUrl = organization.logoUrl;

      // Upload logo if changed
      if (logoFile) {
        // Validate file before upload (double-check, should already be validated on selection)
        if (!logoFile.type || !logoFile.type.startsWith('image/')) {
          setErrors({ logo: 'Invalid file type. Please select an image file.' });
          setIsLoading(false);
          return;
        }
        
        if (logoFile.size > MAX_FILE_SIZE) {
          const fileSizeMB = (logoFile.size / 1024 / 1024).toFixed(2);
          setErrors({ logo: `File too large (${fileSizeMB}MB). Maximum size is ${MAX_FILE_SIZE_MB}MB.` });
          setIsLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", logoFile);
        formData.append("type", "logo");
        formData.append("entityId", organization.id);

        const uploadRes = await fetch("/api/upload", {
          credentials: "include",
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (uploadRes.ok && uploadData.success && uploadData.data?.url) {
          finalLogoUrl = uploadData.data.url;
        } else {
          // Standardized format: { success: false, error: { message: string } }
          const errorMsg = uploadData.error?.message || `Upload failed with status ${uploadRes.status}`;
          setErrors({ logo: errorMsg });
          setIsLoading(false);
          return;
        }
      }

      // Update profile
      const res = await fetch(`/api/organizations/${organization.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          type: type.trim(),
          description: description.trim(),
          websiteUrl: websiteUrl.trim(),
          logoUrl: finalLogoUrl,
        }),
      });

      const data = await res.json();

      // Standardized format: { success: true, data: { organization: {...} } }
      if (res.ok && data.success && data.data?.organization) {
        // Update context immediately with the new data from server
        const updatedOrg = data.data.organization;
        updateOrganization({
          ...organization,
          name: updatedOrg.name,
          email: updatedOrg.email,
          type: updatedOrg.type,
          description: updatedOrg.description,
          websiteUrl: updatedOrg.websiteUrl,
          logoUrl: updatedOrg.logoUrl, // Use the logoUrl from server response
        });
        // Also refresh to ensure everything is in sync
        await refreshOrganization();
        onClose();
      } else {
        let errorMsg = data.error?.message || "Failed to update profile";
        
        // Provide helpful error message for auth issues
        if (res.status === 401) {
          errorMsg = "You are not logged in as an organization. Please log out and log in again as an organization.";
        } else if (res.status === 403) {
          errorMsg = "You don't have permission to update this organization.";
        }
        
        setErrors({ general: errorMsg });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error. Please try again.";
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={handleBackdropClick}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 overflow-y-auto py-8">
        <div 
          className="w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-white shadow-2xl px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10 animate-in zoom-in-95 duration-200 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Close dialog"
          >
            <span className="text-gray-500 text-xl leading-none">×</span>
          </button>

          {/* Logo section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
              <Image
                src={logoUrl}
                alt="Organization logo"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleLogoClick}
                className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:scale-105 transition"
                aria-label="Edit logo"
              >
                <Image
                  src="/pencil.svg"
                  alt="Edit logo"
                  width={16}
                  height={16}
                />
              </button>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                ref={fileInputRef}
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
            <p className="mt-3 font-outfit text-sm text-[#4B5B72]">
              Edit Logo
            </p>
            {errors.logo && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg max-w-md">
                <p className="text-sm text-red-600 text-center">{errors.logo}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error Message */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">{errors.general}</p>
              </div>
            )}
            
            {/* Name */}
            <div>
              <label className="block font-outfit font-medium text-sm text-gray-700 mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                placeholder="Enter organization name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-outfit font-medium text-sm text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                required
                className={`w-full rounded-lg border px-4 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] ${
                  errors.email ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="organization@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block font-outfit font-medium text-sm text-gray-700 mb-2">
                Organization Type
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                placeholder="e.g., NGO, Company, Association"
              />
            </div>

            {/* Website URL */}
            <div>
              <label className="block font-outfit font-medium text-sm text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => {
                  setWebsiteUrl(e.target.value);
                  if (errors.websiteUrl) {
                    setErrors({ ...errors, websiteUrl: undefined });
                  }
                }}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] ${
                  errors.websiteUrl ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="https://yoursite.com"
              />
              {errors.websiteUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.websiteUrl}</p>
              )}
            </div>

            {/* Description with Markdown Toolbar */}
            <div>
              <label className="block font-outfit font-medium text-sm text-gray-700 mb-2">
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full rounded-b-lg border border-gray-200 px-4 py-3 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] resize-none"
                placeholder="Write your organization description here... (Markdown supported)"
              />
            </div>

            {/* Submit button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-sm font-outfit font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-xl bg-[#1e4e79] text-sm font-outfit font-semibold text-white hover:bg-[#163a5c] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

