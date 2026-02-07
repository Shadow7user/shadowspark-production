"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createCourse, updateCourse } from "@/lib/actions/admin";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type CourseCategory =
  | "AI_PROMPTING"
  | "WEB_DEVELOPMENT"
  | "AUTOMATION"
  | "BUSINESS"
  | "GRAPHIC_DESIGN"
  | "PRODUCT_DESIGN"
  | "SEO_MARKETING";
type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "PROFESSIONAL";

interface CourseFormProps {
  course?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: CourseCategory;
    level: CourseLevel;
    price: number | { toString(): string };
    thumbnail: string | null;
    published: boolean;
    featured: boolean;
  };
}

const categories: { value: CourseCategory; label: string }[] = [
  { value: "AI_PROMPTING", label: "AI & Prompting" },
  { value: "WEB_DEVELOPMENT", label: "Web Development" },
  { value: "AUTOMATION", label: "Automation" },
  { value: "BUSINESS", label: "Business" },
  { value: "GRAPHIC_DESIGN", label: "Graphic Design" },
  { value: "PRODUCT_DESIGN", label: "Product Design" },
  { value: "SEO_MARKETING", label: "SEO & Marketing" },
];

const levels: { value: CourseLevel; label: string }[] = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "PROFESSIONAL", label: "Professional" },
];

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: course?.title || "",
    slug: course?.slug || "",
    description: course?.description || "",
    category: course?.category || ("WEB_DEVELOPMENT" as CourseCategory),
    level: course?.level || ("BEGINNER" as CourseLevel),
    price: course?.price ? Number(course.price) : 15000,
    thumbnail: course?.thumbnail || "",
    published: course?.published || false,
    featured: course?.featured || false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: course ? prev.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        if (course) {
          await updateCourse(course.id, formData);
        } else {
          await createCourse(formData);
        }
        router.push("/admin/courses");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Course title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="course-url-slug"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe what students will learn..."
              rows={4}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: CourseCategory) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value: CourseLevel) =>
                  setFormData((prev) => ({ ...prev, level: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((lvl) => (
                    <SelectItem key={lvl.value} value={lvl.value}>
                      {lvl.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₦)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: parseInt(e.target.value) || 0,
                  }))
                }
                min={0}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, thumbnail: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="published">Published</Label>
              <p className="text-sm text-muted-foreground">
                Make this course visible to students
              </p>
            </div>
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked: boolean) =>
                setFormData((prev) => ({ ...prev, published: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="featured">Featured</Label>
              <p className="text-sm text-muted-foreground">
                Show on homepage and course listings
              </p>
            </div>
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked: boolean) =>
                setFormData((prev) => ({ ...prev, featured: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {course ? "Update Course" : "Create Course"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
