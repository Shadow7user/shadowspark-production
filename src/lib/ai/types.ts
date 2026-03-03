export type MessageHistory = Array<{
  role: "user" | "assistant";
  content: string;
}>;
