"use client";

import { FormEvent, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Bold, Italic, Link, List } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function EditProfileDialog({ isOpen, onClose }: Props) {
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>("/profile_pic.png");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; portfolioUrl?: string }>({});

  // Validation functions
  const validatePhone = (value: string): string | undefined => {
    if (!value) return undefined; // Optional field
    // Allow formats: +213 555 123 456, 0555123456, +213555123456, etc.
    const phoneRegex = /^(\+?[0-9]{1,4}[\s-]?)?[0-9]{6,14}$/;
    const cleanedPhone = value.replace(/[\s-]/g, "");
    if (!phoneRegex.test(cleanedPhone)) {
      return "Please enter a valid phone number (e.g., +213 555 123 456)";
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
      return "Please enter a valid URL (e.g., https://yourportfolio.com)";
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bioTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Markdown toolbar functions
  const wrapSelectedText = (before: string, after: string) => {
    const textarea = bioTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = bio.substring(start, end);
    
    const newText = bio.substring(0, start) + before + selectedText + after + bio.substring(end);
    setBio(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const insertLink = () => {
    const textarea = bioTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = bio.substring(start, end);
    
    const linkText = selectedText || "link text";
    const newText = bio.substring(0, start) + `[${linkText}](url)` + bio.substring(end);
    setBio(newText);

    setTimeout(() => {
      textarea.focus();
      // Select "url" so user can type the actual URL
      const urlStart = start + linkText.length + 3;
      textarea.setSelectionRange(urlStart, urlStart + 3);
    }, 0);
  };

  const insertList = () => {
    const textarea = bioTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = bio.substring(0, start) + "\n- " + bio.substring(start);
    setBio(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 3, start + 3);
    }, 0);
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setPortfolioUrl(user.portfolioUrl || "");
      setPhotoUrl(user.avatarUrl || "/profile_pic.png");
      setPhotoFile(null);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate fields
    const phoneError = validatePhone(phone);
    const urlError = validateUrl(portfolioUrl);
    
    if (phoneError || urlError) {
      setErrors({ phone: phoneError, portfolioUrl: urlError });
      return;
    }
    
    setErrors({});
    setIsLoading(true);

    try {
      let avatarUrl = user.avatarUrl;

      // Upload photo if changed
      if (photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);
        formData.append("type", "avatar");
        formData.append("entityId", user.id);

        const uploadRes = await fetch("/api/upload", {
          credentials: "include",
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          // Handle both new format (data.data.url) and old format (data.url) (i'll update the api to return the same format for both TODO!!)
          avatarUrl = uploadData.data?.url || uploadData.url;
        }
      }

      // Update profile
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          bio: bio.trim(),
          portfolioUrl: portfolioUrl.trim(),
          avatarUrl,
        }),
      });

      if (res.ok) {
        updateUser({
          name: name.trim(),
          phone: phone.trim(),
          bio: bio.trim(),
          portfolioUrl: portfolioUrl.trim(),
          avatarUrl,
        });
        onClose();
      }
    } catch (error) {
      // Failed to update profile - error handled by component state
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
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

          {/* Photo section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
              <Image
                src={photoUrl}
                alt="Profile photo"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handlePhotoClick}
                className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:scale-105 transition"
                aria-label="Edit photo"
              >
                <Image
                  src="/pencil.svg"
                  alt="Edit photo"
                  width={16}
                  height={16}
                />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <p className="mt-3 font-outfit text-sm text-[#4B5B72]">
              Edit Photo
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1">
              <label className="font-outfit text-sm text-[#4B5B72]">
                Full Name
              </label>
              <input
                className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-outfit outline-none focus:border-[#4fa3e3] transition-colors"
                placeholder="Edit your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-outfit text-sm text-[#4B5B72]">
                Phone Number
              </label>
              <input
                className={`rounded-xl border px-4 py-2 text-sm font-outfit outline-none transition-colors ${
                  errors.phone ? "border-red-400 focus:border-red-500" : "border-[#D1D5DB] focus:border-[#4fa3e3]"
                }`}
                placeholder="+213 555 123 456"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
              />
              {errors.phone && (
                <span className="text-xs text-red-500 mt-1">{errors.phone}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-outfit text-sm text-[#4B5B72]">
                Portfolio URL
              </label>
              <input
                className={`rounded-xl border px-4 py-2 text-sm font-outfit outline-none transition-colors ${
                  errors.portfolioUrl ? "border-red-400 focus:border-red-500" : "border-[#D1D5DB] focus:border-[#4fa3e3]"
                }`}
                placeholder="https://yourportfolio.com"
                value={portfolioUrl}
                onChange={(e) => {
                  setPortfolioUrl(e.target.value);
                  if (errors.portfolioUrl) setErrors((prev) => ({ ...prev, portfolioUrl: undefined }));
                }}
              />
              {errors.portfolioUrl && (
                <span className="text-xs text-red-500 mt-1">{errors.portfolioUrl}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-outfit text-sm text-[#4B5B72]">
                Description
              </label>
              
              {/* Markdown Toolbar */}
              <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-t-xl border border-b-0 border-[#D1D5DB]">
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
                  <Link size={16} className="text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={insertList}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Insert list item"
                >
                  <List size={16} className="text-gray-600" />
                </button>
                <span className="ml-auto text-xs text-gray-400 pr-2">
                  Select text, then click to format
                </span>
              </div>
              
              <textarea
                ref={bioTextareaRef}
                rows={4}
                className="rounded-b-xl rounded-t-none border border-[#D1D5DB] px-4 py-2 text-sm outline-none focus:border-[#4fa3e3] transition-colors resize-none"
                placeholder="Write your profile description here..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-[#1e4e79] text-sm font-outfit text-white hover:bg-[#2a5f8f] transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full py-3 rounded-full border border-[#E5E7EB] text-sm font-outfit text-[#4B5B72] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
