"use client";

import { useId } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { getStoredToken } from "@/lib/auth";
import { uploadMedia } from "@/lib/api";

type TinyMceEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
};

export default function TinyMceEditor({
  label,
  value,
  onChange,
  minHeight = 480,
}: TinyMceEditorProps) {
  const id = useId();

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </label>
      <div className="overflow-hidden rounded-xl border border-[var(--form-border)] bg-white">
        <Editor
          id={id}
          value={value}
          onEditorChange={onChange}
          licenseKey="gpl"
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          init={{
            height: minHeight,
            menubar: "file edit view insert format table tools",
            branding: false,
            promotion: false,
            resize: true,
            skin: "oxide",
            content_css: "default",
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "media",
              "table",
              "code",
              "visualblocks",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | bold italic underline | forecolor | alignleft aligncenter alignright | bullist numlist outdent indent | link image media table | blockquote code | removeformat",
            block_formats:
              "Paragraph=p; Heading 2=h2; Heading 3=h3; Heading 4=h4; Quote=blockquote",
            // Enable local file upload in Insert/Edit Image dialog
            automatic_uploads: true,
            images_reuse_filename: true,
            file_picker_types: "image",
            images_file_types: "jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp,svg",
            images_upload_handler: async (blobInfo) => {
              const token = getStoredToken();
              if (!token) {
                throw new Error("Please sign in again to upload images.");
              }

              const blob = blobInfo.blob();
              const file = new File([blob], blobInfo.filename() || "image.png", {
                type: blob.type || "image/png",
              });

              const { media } = await uploadMedia(token, file);
              if (!media?.file_url) {
                throw new Error("Upload succeeded but no image URL was returned.");
              }

              return media.file_url;
            },
            file_picker_callback: (callback, _value, meta) => {
              if (meta.filetype !== "image") return;

              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = async () => {
                const file = input.files?.[0];
                if (!file) return;

                const token = getStoredToken();
                if (!token) {
                  window.alert("Please sign in again to upload images.");
                  return;
                }

                try {
                  const { media } = await uploadMedia(token, file);
                  callback(media.file_url, {
                    alt: media.alt_text || file.name,
                    title: media.file_name || file.name,
                  });
                } catch (error) {
                  window.alert(
                    error instanceof Error ? error.message : "Image upload failed"
                  );
                }
              };
              input.click();
            },
            content_style:
              "body { font-family: Inter, system-ui, sans-serif; font-size: 15px; line-height: 1.7; padding: 16px; color: #0f2744; } p { margin: 0 0 1rem; } h2,h3,h4 { color: #0f2744; margin: 1.5rem 0 0.75rem; } a { color: #f97316; } img { max-width: 100%; height: auto; border-radius: 12px; } blockquote { border-left: 3px solid #f97316; margin: 1rem 0; padding-left: 1rem; color: #475569; }",
          }}
        />
      </div>
      <p className="text-xs text-muted">
        Tip: In Insert/Edit Image, use the Upload tab or browse button to upload from your computer.
        Images are saved to Media Library.
      </p>
    </div>
  );
}
