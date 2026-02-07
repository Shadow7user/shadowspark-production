"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  getUploadSignature,
  saveFileRecord,
} from "@/lib/actions/project-files";
import { formatFileSize, getFileType } from "@/lib/cloudinary";
import { AlertCircle, CheckCircle2, Loader2, Upload, X } from "lucide-react";
import { useCallback, useState, useTransition } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  projectId: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: "uploading" | "complete" | "error";
  error?: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function FileUploader({ projectId }: FileUploaderProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [isPending, startTransition] = useTransition();

  const uploadFile = async (file: File) => {
    // Get signed upload credentials
    const creds = await getUploadSignature(projectId);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", creds.apiKey);
    formData.append("timestamp", creds.timestamp.toString());
    formData.append("signature", creds.signature);
    formData.append("folder", creds.folder);

    return new Promise<{ url: string; publicId: string; bytes: number }>(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${creds.cloudName}/auto/upload`,
        );

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploading((prev) =>
              prev.map((u) => (u.file === file ? { ...u, progress } : u)),
            );
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            resolve({
              url: data.secure_url,
              publicId: data.public_id,
              bytes: data.bytes,
            });
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
        xhr.send(formData);
      },
    );
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((f) => f.size <= MAX_FILE_SIZE);

      if (validFiles.length < acceptedFiles.length) {
        alert(`Some files exceed the 50MB limit and were skipped.`);
      }

      const newUploads: UploadingFile[] = validFiles.map((file) => ({
        file,
        progress: 0,
        status: "uploading" as const,
      }));

      setUploading((prev) => [...prev, ...newUploads]);

      validFiles.forEach(async (file) => {
        try {
          const result = await uploadFile(file);

          // Save file record to database
          startTransition(async () => {
            await saveFileRecord({
              projectId,
              name: file.name,
              url: result.url,
              type: getFileType(file.type),
              size: result.bytes,
              cloudinaryId: result.publicId,
            });
          });

          setUploading((prev) =>
            prev.map((u) =>
              u.file === file ? { ...u, status: "complete", progress: 100 } : u,
            ),
          );
        } catch (err) {
          setUploading((prev) =>
            prev.map((u) =>
              u.file === file
                ? {
                    ...u,
                    status: "error",
                    error: err instanceof Error ? err.message : "Failed",
                  }
                : u,
            ),
          );
        }
      });
    },
    [projectId],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
  });

  const removeFromList = (file: File) => {
    setUploading((prev) => prev.filter((u) => u.file !== file));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? "Drop files here..."
            : "Drag & drop files, or click to browse"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Max 50MB per file</p>
      </div>

      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((item, index) => (
            <div
              key={`${item.file.name}-${index}`}
              className="flex items-center gap-3 bg-muted/50 rounded-lg p-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm truncate">{item.file.name}</p>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatFileSize(item.file.size)}
                  </span>
                </div>
                {item.status === "uploading" && (
                  <Progress value={item.progress} className="h-1 mt-1" />
                )}
                {item.status === "error" && (
                  <p className="text-xs text-destructive mt-1">{item.error}</p>
                )}
              </div>

              {item.status === "uploading" && (
                <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
              )}
              {item.status === "complete" && (
                <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
              )}
              {item.status === "error" && (
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              )}

              {item.status !== "uploading" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => removeFromList(item.file)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
