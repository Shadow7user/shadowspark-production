"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createLesson,
  createModule,
  deleteLesson,
  deleteModule,
  updateLesson,
  updateModule,
} from "@/lib/actions/admin";
import {
  FileText,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { useState, useTransition } from "react";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number | null;
  order: number;
  content: string | null;
  isFree: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
}

interface ModuleLessonEditorProps {
  courseId: string;
  modules: Module[];
}

export function ModuleLessonEditor({
  courseId,
  modules: initialModules,
}: ModuleLessonEditorProps) {
  const [modules, setModules] = useState(initialModules);
  const [isPending, startTransition] = useTransition();
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<{
    lesson: Lesson;
    moduleId: string;
  } | null>(null);
  const [newModuleOpen, setNewModuleOpen] = useState(false);
  const [newLessonOpen, setNewLessonOpen] = useState<string | null>(null);

  // Module form state
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" });

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: 0,
    content: "",
    isFree: false,
  });

  const resetModuleForm = () => setModuleForm({ title: "", description: "" });
  const resetLessonForm = () =>
    setLessonForm({
      title: "",
      description: "",
      videoUrl: "",
      duration: 0,
      content: "",
      isFree: false,
    });

  const handleCreateModule = async () => {
    startTransition(async () => {
      const result = await createModule({
        courseId,
        title: moduleForm.title,
        description: moduleForm.description || undefined,
        order: modules.length,
      });
      if (result.success && result.module) {
        setModules((prev) => [...prev, { ...result.module, lessons: [] }]);
        resetModuleForm();
        setNewModuleOpen(false);
      }
    });
  };

  const handleUpdateModule = async () => {
    if (!editingModule) return;
    startTransition(async () => {
      const result = await updateModule(editingModule.id, {
        title: moduleForm.title,
        description: moduleForm.description || undefined,
      });
      if (result.success) {
        setModules((prev) =>
          prev.map((m) =>
            m.id === editingModule.id
              ? {
                  ...m,
                  title: moduleForm.title,
                  description: moduleForm.description,
                }
              : m,
          ),
        );
        setEditingModule(null);
        resetModuleForm();
      }
    });
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    startTransition(async () => {
      const result = await deleteModule(moduleId);
      if (result.success) {
        setModules((prev) => prev.filter((m) => m.id !== moduleId));
      }
    });
  };

  const handleCreateLesson = async (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    startTransition(async () => {
      const result = await createLesson({
        moduleId,
        title: lessonForm.title,
        description: lessonForm.description || undefined,
        videoUrl: lessonForm.videoUrl || undefined,
        duration: lessonForm.duration || undefined,
        content: lessonForm.content || undefined,
        order: module.lessons.length,
        isFree: lessonForm.isFree,
      });
      if (result.success && result.lesson) {
        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId
              ? { ...m, lessons: [...m.lessons, result.lesson as Lesson] }
              : m,
          ),
        );
        resetLessonForm();
        setNewLessonOpen(null);
      }
    });
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;
    startTransition(async () => {
      const result = await updateLesson(editingLesson.lesson.id, {
        title: lessonForm.title,
        description: lessonForm.description || undefined,
        videoUrl: lessonForm.videoUrl || undefined,
        duration: lessonForm.duration || undefined,
        content: lessonForm.content || undefined,
        isFree: lessonForm.isFree,
      });
      if (result.success) {
        setModules((prev) =>
          prev.map((m) =>
            m.id === editingLesson.moduleId
              ? {
                  ...m,
                  lessons: m.lessons.map((l) =>
                    l.id === editingLesson.lesson.id
                      ? { ...l, ...lessonForm }
                      : l,
                  ),
                }
              : m,
          ),
        );
        setEditingLesson(null);
        resetLessonForm();
      }
    });
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm("Delete this lesson?")) return;
    startTransition(async () => {
      const result = await deleteLesson(lessonId);
      if (result.success) {
        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId
              ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
              : m,
          ),
        );
      }
    });
  };

  const openEditModule = (module: Module) => {
    setModuleForm({
      title: module.title,
      description: module.description || "",
    });
    setEditingModule(module);
  };

  const openEditLesson = (lesson: Lesson, moduleId: string) => {
    setLessonForm({
      title: lesson.title,
      description: lesson.description || "",
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration || 0,
      content: lesson.content || "",
      isFree: lesson.isFree,
    });
    setEditingLesson({ lesson, moduleId });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Course Content</CardTitle>
        <Dialog open={newModuleOpen} onOpenChange={setNewModuleOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetModuleForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Module</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="module-title">Title</Label>
                <Input
                  id="module-title"
                  value={moduleForm.title}
                  onChange={(e) =>
                    setModuleForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Module title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-desc">Description</Label>
                <Textarea
                  id="module-desc"
                  value={moduleForm.description}
                  onChange={(e) =>
                    setModuleForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description"
                />
              </div>
              <Button
                onClick={handleCreateModule}
                disabled={isPending || !moduleForm.title}
                className="w-full"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Module
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {modules.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No modules yet. Add your first module to get started.
          </p>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {modules.map((module, moduleIndex) => (
              <AccordionItem
                key={module.id}
                value={module.id}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {moduleIndex + 1}. {module.title}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({module.lessons.length} lessons)
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <div className="flex gap-2 mb-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModule(module)}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteModule(module.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>

                  <div className="space-y-2 mb-4">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          {lesson.videoUrl ? (
                            <Video className="h-4 w-4 text-cyan-500" />
                          ) : (
                            <FileText className="h-4 w-4 text-purple-500" />
                          )}
                          <div>
                            <p className="font-medium text-sm">
                              {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                            </p>
                            {lesson.duration && (
                              <p className="text-xs text-muted-foreground">
                                {lesson.duration} min
                              </p>
                            )}
                          </div>
                          {lesson.isFree && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              Free
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditLesson(lesson, module.id)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleDeleteLesson(module.id, lesson.id)
                            }
                            className="text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Dialog
                    open={newLessonOpen === module.id}
                    onOpenChange={(open) => {
                      setNewLessonOpen(open ? module.id : null);
                      if (!open) resetLessonForm();
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="w-full">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Lesson
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Lesson to {module.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={lessonForm.title}
                            onChange={(e) =>
                              setLessonForm((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Lesson title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={lessonForm.description}
                            onChange={(e) =>
                              setLessonForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Brief description"
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Video URL</Label>
                            <Input
                              value={lessonForm.videoUrl}
                              onChange={(e) =>
                                setLessonForm((prev) => ({
                                  ...prev,
                                  videoUrl: e.target.value,
                                }))
                              }
                              placeholder="https://..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Duration (minutes)</Label>
                            <Input
                              type="number"
                              value={lessonForm.duration}
                              onChange={(e) =>
                                setLessonForm((prev) => ({
                                  ...prev,
                                  duration: parseInt(e.target.value) || 0,
                                }))
                              }
                              min={0}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Content</Label>
                          <Textarea
                            value={lessonForm.content}
                            onChange={(e) =>
                              setLessonForm((prev) => ({
                                ...prev,
                                content: e.target.value,
                              }))
                            }
                            placeholder="Written content for this lesson..."
                            rows={6}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Free Preview</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow non-enrolled users to view
                            </p>
                          </div>
                          <Switch
                            checked={lessonForm.isFree}
                            onCheckedChange={(checked: boolean) =>
                              setLessonForm((prev) => ({
                                ...prev,
                                isFree: checked,
                              }))
                            }
                          />
                        </div>
                        <Button
                          onClick={() => handleCreateLesson(module.id)}
                          disabled={isPending || !lessonForm.title}
                          className="w-full"
                        >
                          {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Add Lesson
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {/* Edit Module Dialog */}
        <Dialog
          open={!!editingModule}
          onOpenChange={(open) => {
            if (!open) {
              setEditingModule(null);
              resetModuleForm();
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Module</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={moduleForm.title}
                  onChange={(e) =>
                    setModuleForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={moduleForm.description}
                  onChange={(e) =>
                    setModuleForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <Button
                onClick={handleUpdateModule}
                disabled={isPending || !moduleForm.title}
                className="w-full"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Lesson Dialog */}
        <Dialog
          open={!!editingLesson}
          onOpenChange={(open) => {
            if (!open) {
              setEditingLesson(null);
              resetLessonForm();
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Lesson</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={lessonForm.title}
                  onChange={(e) =>
                    setLessonForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={lessonForm.description}
                  onChange={(e) =>
                    setLessonForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Video URL</Label>
                  <Input
                    value={lessonForm.videoUrl}
                    onChange={(e) =>
                      setLessonForm((prev) => ({
                        ...prev,
                        videoUrl: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={lessonForm.duration}
                    onChange={(e) =>
                      setLessonForm((prev) => ({
                        ...prev,
                        duration: parseInt(e.target.value) || 0,
                      }))
                    }
                    min={0}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={lessonForm.content}
                  onChange={(e) =>
                    setLessonForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  rows={6}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Free Preview</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow non-enrolled users to view
                  </p>
                </div>
                <Switch
                  checked={lessonForm.isFree}
                  onCheckedChange={(checked: boolean) =>
                    setLessonForm((prev) => ({ ...prev, isFree: checked }))
                  }
                />
              </div>
              <Button
                onClick={handleUpdateLesson}
                disabled={isPending || !lessonForm.title}
                className="w-full"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
