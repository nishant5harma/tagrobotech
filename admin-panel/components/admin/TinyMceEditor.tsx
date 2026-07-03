"use client";

import { useId } from "react";
import { Editor } from "@tinymce/tinymce-react";

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
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          init={{
            license_key: "gpl",
            height: minHeight,
            menubar: "file edit view insert format table tools",
            branding: false,
            promotion: false,
            resize: true,
            skin: "oxide",
            content_css: "default",
            plugins: ["advlist", "autolink", "lists", "link", "image", "media", "table", "code", "visualblocks", "wordcount"],
            toolbar:
              "undo redo | blocks | bold italic underline | forecolor | alignleft aligncenter alignright | bullist numlist outdent indent | link image media table | blockquote code | removeformat",
            block_formats:
              "Paragraph=p; Heading 2=h2; Heading 3=h3; Heading 4=h4; Quote=blockquote",
            content_style:
              "body { font-family: Inter, system-ui, sans-serif; font-size: 15px; line-height: 1.7; padding: 16px; color: #0f2744; } p { margin: 0 0 1rem; } h2,h3,h4 { color: #0f2744; margin: 1.5rem 0 0.75rem; } a { color: #f97316; } blockquote { border-left: 3px solid #f97316; margin: 1rem 0; padding-left: 1rem; color: #475569; }",
          }}
        />
      </div>
    </div>
  );
}
