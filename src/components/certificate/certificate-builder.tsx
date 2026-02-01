"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface CertificateProps {
  studentName: string;
  courseTitle: string;
  completionDate: string;
  certificateId: string;
}

export function CertificateBuilder({
  studentName,
  courseTitle,
  completionDate,
  certificateId,
}: CertificateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size (HD resolution)
    canvas.width = 1024;
    canvas.height = 640;

    // Background gradient (ShadowSpark cyberpunk)
    const gradient = ctx.createLinearGradient(0, 0, 1024, 640);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(0.5, "#16213e");
    gradient.addColorStop(1, "#0f3460");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 640);

    // Outer border - Cyan glow
    ctx.strokeStyle = "#00FFD5";
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 984, 600);

    // Inner decorative border
    ctx.strokeStyle = "#BD00FF40";
    ctx.lineWidth = 1;
    ctx.strokeRect(35, 35, 954, 570);

    // Accent corners - Purple
    ctx.fillStyle = "#BD00FF";
    // Top-left
    ctx.fillRect(20, 20, 60, 4);
    ctx.fillRect(20, 20, 4, 60);
    // Top-right
    ctx.fillRect(944, 20, 60, 4);
    ctx.fillRect(1000, 20, 4, 60);
    // Bottom-left
    ctx.fillRect(20, 616, 60, 4);
    ctx.fillRect(20, 560, 4, 60);
    // Bottom-right
    ctx.fillRect(944, 616, 60, 4);
    ctx.fillRect(1000, 560, 4, 60);

    // ShadowSpark logo area (placeholder - geometric pattern)
    ctx.fillStyle = "#BD00FF";
    ctx.beginPath();
    ctx.moveTo(512, 50);
    ctx.lineTo(532, 80);
    ctx.lineTo(492, 80);
    ctx.closePath();
    ctx.fill();

    // Company name
    ctx.fillStyle = "#00FFD5";
    ctx.font = "bold 14px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SHADOWSPARK TECHNOLOGIES", 512, 105);

    // Main title
    ctx.fillStyle = "#00FFD5";
    ctx.font = "bold 42px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Completion", 512, 170);

    // Decorative line under title
    const lineGradient = ctx.createLinearGradient(300, 185, 724, 185);
    lineGradient.addColorStop(0, "#BD00FF00");
    lineGradient.addColorStop(0.5, "#BD00FF");
    lineGradient.addColorStop(1, "#BD00FF00");
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 185);
    ctx.lineTo(724, 185);
    ctx.stroke();

    // "This certifies that"
    ctx.fillStyle = "#AAAAAA";
    ctx.font = "16px Arial, sans-serif";
    ctx.fillText("This certifies that", 512, 230);

    // Student name
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 36px Georgia, serif";
    ctx.fillText(studentName, 512, 280);

    // Decorative line under name
    ctx.strokeStyle = "#00FFD540";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(250, 295);
    ctx.lineTo(774, 295);
    ctx.stroke();

    // "has successfully completed"
    ctx.fillStyle = "#AAAAAA";
    ctx.font = "16px Arial, sans-serif";
    ctx.fillText("has successfully completed", 512, 340);

    // Course name (with word wrap for long titles)
    ctx.fillStyle = "#BD00FF";
    ctx.font = "bold 28px Arial, sans-serif";

    // Simple word wrap for course title
    const maxWidth = 700;
    const words = courseTitle.split(" ");
    let line = "";
    let y = 385;
    const lineHeight = 35;

    for (const word of words) {
      const testLine = line + word + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== "") {
        ctx.fillText(line.trim(), 512, y);
        line = word + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), 512, y);

    // "from ShadowSpark AI Academy"
    ctx.fillStyle = "#AAAAAA";
    ctx.font = "14px Arial, sans-serif";
    ctx.fillText("from ShadowSpark AI Academy", 512, y + 40);

    // Bottom section - Date and Certificate ID
    ctx.fillStyle = "#666666";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Certificate ID: ${certificateId}`, 60, 560);

    ctx.textAlign = "right";
    ctx.fillText(`Date: ${completionDate}`, 964, 560);

    // Verification note
    ctx.textAlign = "center";
    ctx.fillStyle = "#444444";
    ctx.font = "10px Arial, sans-serif";

    // Dynamic domain
    const domain = process.env.NEXT_PUBLIC_APP_URL || "shadowspark-tech.org";
    const displayDomain = domain.replace(/^https?:\/\//, "");

    ctx.fillText(
      `Verify at ${displayDomain}/verify/${certificateId}`,
      512,
      590,
    );

    setIsGenerating(false);
  }, [studentName, courseTitle, completionDate, certificateId]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png", 1.0);
    link.download = `shadowspark-certificate-${certificateId}.png`;
    link.click();
  };

  const domain =
    process.env.NEXT_PUBLIC_APP_URL || "https://shadowspark-tech.org";

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(
      `🎉 I just completed "${courseTitle}" at ShadowSpark AI Academy! #AI #Learning #ShadowSpark`,
    );
    const url = encodeURIComponent(`${domain}/verify/${certificateId}`);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
      "_blank",
    );
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `🎉 I just completed "${courseTitle}" at @ShadowSparkTech AI Academy!\n\nVerify: ${domain}/verify/${certificateId}\n\n#AI #Learning #Nigeria`,
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-card rounded-lg border">
      <h3 className="text-xl font-bold text-foreground">
        🎓 Your Certificate of Completion
      </h3>

      <div className="relative">
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="border border-cyan-500/50 rounded-lg max-w-full shadow-lg shadow-cyan-500/20"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={handleDownload}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
        >
          📥 Download Certificate
        </Button>
        <Button
          onClick={handleShareLinkedIn}
          variant="outline"
          className="border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5] hover:text-white"
        >
          Share on LinkedIn
        </Button>
        <Button
          onClick={handleShareTwitter}
          variant="outline"
          className="border-[#1DA1F2] text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white"
        >
          Share on X
        </Button>
      </div>
    </div>
  );
}
